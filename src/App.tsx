import React, { useState, useEffect } from "react";
import SidebarNav from "./components/SidebarNav";
import ApiEndpointDoc from "./components/ApiEndpointDoc";
import LoginPage from "./pages/LoginPage";
import AddDevicePage from "./pages/AddDevicePage";
import AccessCodePage from "./pages/AccessCodePage";
import { Magic } from "magic-sdk";

// TODO: Replace with your actual Magic.link Publishable API Key
const magic = new Magic("pk_live_DF7C05FE3A4FD8A6");

function App() {
  const [currentPage, setCurrentPage] = useState<string>(
    window.location.hash || "#home",
  );
  const initialIsLargeScreen = window.innerWidth >= 1024;
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialIsLargeScreen);
  const [isMobile, setIsMobile] = useState(!initialIsLargeScreen);
  const [token, setToken] = useState<string>("");
  const [profile, setProfile] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMagicLoading, setIsMagicLoading] = useState<boolean>(true);

  // Add a function to fetch user info and set profile globally
  const fetchAndSetUserProfile = async (token: string) => {
    try {
      const response = await fetch("/api/users/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Token: token,
        },
      });
      const data = await response.json();
      if (
        data &&
        data.secuses &&
        data.user &&
        data.user.profile !== undefined
      ) {
        setProfile(String(data.user.profile));
        localStorage.setItem("cub_api_profile", String(data.user.profile));
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  // New: Generate custom token after Magic login
  const generateAndSetCustomToken = async () => {
    try {
      // Get the Magic Link DID token
      const didToken = await magic.user.getIdToken();
      console.log("Sending DID token to /api/token/generate:", didToken);
      const resp = await fetch("http://localhost:3000/api/token/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: didToken,
        },
        credentials: "include",
      });
      const data = await resp.json();
      if (data && data.success && data.token && data.profile) {
        setTokenAndCookie(data.token);
        setProfile(String(data.profile.id));
        localStorage.setItem("cub_api_token", data.token);
        localStorage.setItem("cub_api_profile", String(data.profile.id));
      } else {
        console.error("Failed to generate custom token:", data);
      }
    } catch (err) {
      console.error("Error generating custom token:", err);
    }
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash || "#home");
    };

    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      setIsSidebarOpen(isLargeScreen);
      setIsMobile(!isLargeScreen);
    };

    // Function to check Magic login status
    const checkMagicLogin = async () => {
      try {
        const isLoggedIn = await magic.user.isLoggedIn();
        console.log("Magic Link isLoggedIn:", isLoggedIn);
        if (isLoggedIn) {
          const metadata = await magic.user.getInfo();
          if (metadata.email) {
            setUserEmail(metadata.email);
          }
          // After Magic login, always generate a new custom token
          await generateAndSetCustomToken();
        }
      } catch (error) {
        console.error("Magic Link session check failed:", error);
      } finally {
        setIsMagicLoading(false);
      }
    };

    // Load token and profile from localStorage on initial render
    const storedToken = localStorage.getItem("cub_api_token");
    const storedProfile = localStorage.getItem("cub_api_profile");
    if (storedToken) {
      setToken(storedToken);
      // Always fetch and set the latest profile from backend
      fetchAndSetUserProfile(storedToken);
    }
    if (storedProfile) {
      setProfile(storedProfile);
    }

    // Set initial state on mount
    handleResize();
    checkMagicLogin();

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Patch setToken to always set the cookie immediately
  const setTokenAndCookie: React.Dispatch<React.SetStateAction<string>> = (
    value,
  ) => {
    let newValue: string;
    if (typeof value === "function") {
      // value is (prev: string) => string
      newValue = (value as (prev: string) => string)(token);
    } else {
      newValue = value;
    }
    setToken(newValue);
    if (newValue) {
      document.cookie = `token=${newValue}; path=/;`;
    } else {
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await magic.user.logout();
      setUserEmail(null);
      setToken("");
      setProfile("");
      localStorage.removeItem("cub_api_token");
      localStorage.removeItem("cub_api_profile");
      // Optionally, redirect to login page or home page
      setCurrentPage("#home");
    } catch (error) {
      console.error("Magic Link logout failed:", error);
    }
  };

  // New: After Magic login, also generate token if user logs in via LoginPage
  const handleLoginSuccess = async (email: string) => {
    setUserEmail(email);
    await generateAndSetCustomToken();
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#252425] font-sans">
      {/* Header */}
      <header className="flex items-center border-b border-[#c8c9c8] px-8 py-6">
        <div className="w-8 h-8 mr-4 bg-transparent flex items-center justify-center">
          <span className="sr-only">CUB Logo</span>
        </div>
        <div className="text-2xl font-semibold tracking-tight">
          CUB / <span className="font-normal text-[#aa566f]">API</span>
        </div>
        <div className="ml-auto text-sm opacity-70">v1.29</div>
        {userEmail && (
          <div className="ml-4 text-sm font-semibold text-gray-800">
            Logged in as: {userEmail}
          </div>
        )}
        {userEmail && (
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        )}
        {/* Menu icon for mobile */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="ml-4 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#aa566f]"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        )}
      </header>
      {/* Layout */}
      <div className="flex w-full h-[calc(100vh-60px)]">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 bg-[#fbfbfb] border-r border-[#c8c9c8] w-70
          ${
            isMobile
              ? `fixed inset-y-0 left-0 z-40 transform h-full overflow-y-auto flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`
              : "static block translate-x-0 opacity-100 pointer-events-auto"
          }
        `}
        >
          <div className="flex-1 overflow-y-auto">
            <SidebarNav
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>

        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main content */}
        <main className={`flex-1 px-8 py-10`}>
          {isMagicLoading ? (
            <div className="flex items-center justify-center min-h-screen">
              <p>Loading user session...</p>
            </div>
          ) : !userEmail ? (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          ) : (
            <>
              {currentPage === "#home" && (
                <>
                  {/* Placeholder for welcome & API docs */}
                  <section id="home" className="mb-10">
                    <h1 className="text-3xl font-extrabold mb-2">
                      Welcome to the API
                    </h1>
                    <p className="text-base max-w-2xl">
                      CUB REST API allows you to interact with CUB
                      programmatically. Use this API to build applications,
                      integrations, or automation scripts. This page documents
                      the REST resources available on CUB, including HTTP
                      response codes and request & response examples.
                    </p>
                  </section>
                  {/* Authentication & Authorization */}
                  <section id="auth" className="mb-10">
                    <h2 className="text-xl font-bold mb-2">
                      Authentication & Authorization
                    </h2>
                    <p className="max-w-2xl">
                      To access the API, you must be authenticated. Obtain an
                      access token by{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        authorizing your device
                      </a>
                      . The token should be sent in the{" "}
                      <code className="px-1 bg-[#f4f4f4] rounded">token</code>{" "}
                      header. Some API methods require the{" "}
                      <code className="px-1 bg-[#f4f4f4] rounded">profile</code>{" "}
                      header with your user profile ID.
                    </p>
                  </section>
                  {/* Making Requests */}
                  <section id="requests" className="mb-10">
                    <h2 className="text-xl font-bold mb-2">Making Requests</h2>
                    <p className="max-w-2xl">
                      All API requests use the{" "}
                      <code className="px-1 bg-[#f4f4f4] rounded">https</code>{" "}
                      protocol (or{" "}
                      <code className="px-1 bg-[#f4f4f4] rounded">http</code>),
                      and should be sent to{" "}
                      <code className="px-1 bg-[#f4f4f4] rounded">
                        https://cub.rip/api/
                      </code>
                      . All responses are in JSON format.
                    </p>
                  </section>
                  {/* Premium API */}
                  <section id="premium" className="mb-10">
                    <h2 className="text-xl font-bold mb-2">Premium API</h2>
                    <p className="max-w-2xl">
                      Some API methods require a premium account. For access,{" "}
                      <a
                        href="https://cub.rip/premium"
                        className="underline text-[#aa566f]"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        get premium here
                      </a>
                      .
                    </p>
                  </section>
                  {/* Example Code Block */}
                  <section id="example" className="mb-10">
                    <h2 className="text-xl font-bold mb-2">Example Request</h2>
                    <p className="max-w-2xl mb-2">
                      Here is an example API call using JavaScript{" "}
                      <code className="px-1 bg-[#f4f4f4] rounded">fetch</code>:
                    </p>
                    <pre className="rounded bg-[#252425] text-[#fbfbfb] text-sm p-4 overflow-x-auto">
                      <code>{`fetch('https://cub.rip/api/bookmarks/all', {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
    'token': 'YOUR_ACCESS_TOKEN',
    'profile': 'YOUR_PROFILE_ID'
  }
})
  .then(response => response.json())
  .then(json => {
    console.log(json);
  })
  .catch(error => {
    console.error(error);
  });
`}</code>
                    </pre>
                  </section>
                  {/* VPN/Attention Warning */}
                  <section id="warning" className="mb-10">
                    <div className="rounded border-l-4 border-[#aa566f] bg-[#df9cb1]/20 p-4 max-w-2xl">
                      <div className="font-semibold mb-1 text-[#aa566f]">
                        Attention
                      </div>
                      <div className="text-sm text-[#252425]">
                        In some countries API access may be blocked. If you have
                        trouble connecting, use a VPN service or one of the
                        available cub.rip mirrors.
                      </div>
                    </div>
                  </section>
                </>
              )}

              {currentPage === "#bookmarks-all" && (
                <ApiEndpointDoc
                  title="Bookmarks All"
                  description="Returns the user's list of bookmarks."
                  method="GET"
                  path="/bookmarks/all"
                  queryParams={[
                    {
                      name: "full",
                      type: "integer",
                      description:
                        "Returns the entire list. By default, unique cards without history are returned.",
                      defaultValue: "0",
                    },
                    {
                      name: "type",
                      type: "string",
                      description: "Bookmark type.",
                      defaultValue: "book",
                      options: ["book", "history", "like", "wath"],
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify(
                    [
                      {
                        type: "like",
                        count: 7,
                      },
                      {
                        type: "wath",
                        count: 6,
                      },
                    ],
                    null,
                    2,
                  )}
                  errors={[
                    {
                      statusCode: 300,
                      description: "Error in data",
                    },
                  ]}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#bookmarks-add" && (
                <ApiEndpointDoc
                  title="Bookmarks Add"
                  description="Add a new bookmark."
                  method="POST"
                  path="/bookmarks/add"
                  bodyParams={[
                    {
                      name: "data",
                      type: "object",
                      description: "JSON card with required fields:",
                      defaultValue:
                        '{"id": "123456789", "title": "Example Movie"}',
                      options: [
                        "poster_path",
                        "overview",
                        "release_date",
                        "genre_ids",
                        "id",
                        "original_title",
                        "original_language",
                        "title",
                        "backdrop_path",
                        "popularity",
                        "vote_count",
                        "vote_average",
                        "imdb_id",
                        "kinopoisk_id",
                        "original_name",
                        "name",
                        "first_air_date",
                        "origin_country",
                        "status",
                        "pg",
                        "release_quality",
                        "imdb_rating",
                        "kp_rating",
                        "source",
                        "number_of_seasons",
                        "number_of_episodes",
                        "next_episode_to_air",
                        "img",
                        "poster",
                        "background_image",
                      ],
                    },
                    {
                      name: "type",
                      type: "string",
                      description:
                        "Type: book, history, like, wath (required).",
                      defaultValue: "book",
                      options: ["book", "history", "like", "wath"],
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify({ success: true }, null, 2)}
                  errors={[
                    {
                      statusCode: 300,
                      description: "Error in data",
                    },
                    {
                      statusCode: 555,
                      description: "No premium access",
                    },
                  ]}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#bookmarks-remove" && (
                <ApiEndpointDoc
                  title="Bookmarks Remove"
                  description="Remove an existing bookmark."
                  method="POST"
                  path="/bookmarks/remove"
                  bodyParams={[
                    {
                      name: "id",
                      type: "integer",
                      description: "ID of the entry.",
                      defaultValue: "9938938",
                    },
                    {
                      name: "list",
                      type: "array",
                      description:
                        "Or a list of entry IDs (e.g., [455, 333, 7854, 3222...]).",
                      defaultValue: "[455,333]",
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify({ success: true }, null, 2)}
                  errors={[
                    {
                      statusCode: 300,
                      description: "Error in data",
                    },
                  ]}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#card-season" && (
                <ApiEndpointDoc
                  title="Card Season"
                  description="Retrieve information about the current season."
                  method="POST"
                  path="/card/season"
                  bodyParams={[
                    {
                      name: "id",
                      type: "integer",
                      description: "Card ID required",
                      defaultValue: "95396",
                    },
                    {
                      name: "original_name",
                      type: "string",
                      description:
                        "Original card name, used to generate time-code hash required",
                      defaultValue: "Severance",
                    },
                    {
                      name: "season",
                      type: "integer",
                      description: "Season number required",
                      defaultValue: "1",
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify(
                    { season: "Spring 2025" },
                    null,
                    2,
                  )}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#card-subscribed" && (
                <ApiEndpointDoc
                  title="Card Subscribed"
                  description="Check if the authenticated user is subscribed to premium."
                  method="POST"
                  path="/card/subscribed"
                  bodyParams={[
                    {
                      name: "id",
                      type: "integer",
                      description: "ID of the card (required).",
                      defaultValue: "95396",
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify(
                    { subscribed: true },
                    null,
                    2,
                  )}
                  errors={[
                    {
                      statusCode: 466,
                      description: "No subscriptions",
                    },
                  ]}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#card-translations" && (
                <ApiEndpointDoc
                  title="Card Translations"
                  description="Retrieve card translations."
                  method="POST"
                  path="/card/translations"
                  bodyParams={[
                    {
                      name: "id",
                      type: "integer",
                      description: "ID of the card (required).",
                      defaultValue: "95396",
                    },
                    {
                      name: "season",
                      type: "integer",
                      description: "Season number (required).",
                      defaultValue: "1",
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify(
                    { lang: "en", title: "Title" },
                    null,
                    2,
                  )}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#card-unsubscribe" && (
                <ApiEndpointDoc
                  title="Card Unsubscribe"
                  description="Unsubscribe the authenticated user from premium."
                  method="POST"
                  path="/card/unsubscribe"
                  bodyParams={[
                    {
                      name: "id",
                      type: "integer",
                      description: "ID of the card (required).",
                      defaultValue: "95396",
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify({ success: true }, null, 2)}
                  errors={[
                    {
                      statusCode: 500,
                      description:
                        "An unexpected error occurred or did not subscribe to the translation",
                    },
                  ]}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#device-add" && (
                <AccessCodePage
                  userEmail={userEmail}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                />
              )}

              {currentPage === "#notice-all" && (
                <ApiEndpointDoc
                  title="Notice All"
                  description="Retrieve all notices for the authenticated user."
                  method="GET"
                  path="/notice/all"
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify([], null, 2)}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#notice-clear" && (
                <ApiEndpointDoc
                  title="Notice Clear"
                  description="Clear all notifications for the authenticated user."
                  method="GET"
                  path="/notice/clear"
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify({ success: true }, null, 2)}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#notifications-all" && (
                <ApiEndpointDoc
                  title="Notifications All"
                  description="Retrieve all notifications for the authenticated user."
                  method="GET"
                  path="/notifications/all"
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify([], null, 2)}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#notifications-add" && (
                <ApiEndpointDoc
                  title="Notifications Add"
                  description="Add a new notification."
                  method="POST"
                  path="/notifications/add"
                  bodyParams={[
                    {
                      name: "data",
                      type: "object",
                      description: "JSON card with required fields:",
                      defaultValue: "{...}",
                      options: [
                        "poster_path",
                        "overview",
                        "release_date",
                        "genre_ids",
                        "id",
                        "original_title",
                        "original_language",
                        "title",
                        "backdrop_path",
                        "popularity",
                        "vote_count",
                        "vote_average",
                        "imdb_id",
                        "kinopoisk_id",
                        "original_name",
                        "name",
                        "first_air_date",
                        "origin_country",
                        "status",
                        "pg",
                        "release_quality",
                        "imdb_rating",
                        "kp_rating",
                        "source",
                        "number_of_seasons",
                        "number_of_episodes",
                        "next_episode_to_air",
                        "img",
                        "poster",
                        "background_image",
                      ],
                    },
                    {
                      name: "voice",
                      type: "string",
                      description:
                        'Name of the translation, e.g., LostFilm. <a href="#card-translations" class="underline text-[#aa566f]">Get a list of available translations</a> (required).',
                      defaultValue: "",
                    },
                    {
                      name: "season",
                      type: "integer",
                      description: "Season number to stop at (default 1).",
                      defaultValue: "1",
                    },
                    {
                      name: "episode",
                      type: "integer",
                      description: "Episode number to stop at (default 1).",
                      defaultValue: "1",
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify({ success: true }, null, 2)}
                  errors={[
                    {
                      statusCode: 300,
                      description: "Error in data",
                    },
                    {
                      statusCode: 429,
                      description: "Notification limit exceeded",
                    },
                  ]}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#notifications-remove" && (
                <ApiEndpointDoc
                  title="Notifications Remove"
                  description="Remove an existing notification."
                  method="POST"
                  path="/notifications/remove"
                  bodyParams={[
                    {
                      name: "id",
                      type: "integer",
                      description:
                        "ID of the notification to remove (required).",
                      defaultValue: "1",
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify({ success: true }, null, 2)}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#notifications-status" && (
                <ApiEndpointDoc
                  title="Notifications Status"
                  description="Set the notification status for a specific entry."
                  method="POST"
                  path="/notifications/status"
                  bodyParams={[
                    {
                      name: "id",
                      type: "integer",
                      description: "Notification ID (required).",
                      defaultValue: "18",
                    },
                    {
                      name: "status",
                      type: "integer",
                      description:
                        "Status (0 or 1, required). 0 means disabled, 1 means enabled.",
                      defaultValue: "1",
                      options: ["0", "1"],
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify(
                    { enabled: true, unread_count: 5 },
                    null,
                    2,
                  )}
                  errors={[
                    {
                      statusCode: 400,
                      description:
                        "Notification ID and a valid status (0 or 1) are required.",
                    },
                    {
                      statusCode: 404,
                      description:
                        "Notification not found or not authorized for this user/profile.",
                    },
                  ]}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#timeline-all" && (
                <ApiEndpointDoc
                  title="Timeline All"
                  description="Returns the user's timeline data."
                  method="GET"
                  path="/timeline/all"
                  queryParams={[
                    {
                      name: "full",
                      type: "boolean",
                      description:
                        "Returns the entire timeline. Defaults to false.",
                      defaultValue: "false",
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify(
                    {
                      secuses: true,
                      timelines: {},
                    },
                    null,
                    2,
                  )}
                  errors={[
                    {
                      statusCode: 500,
                      description: "Internal server error.",
                    },
                  ]}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#profiles-all" && (
                <ApiEndpointDoc
                  title="Profiles All"
                  description="Retrieve all profiles for the authenticated user."
                  method="GET"
                  path="/profiles/all"
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify(
                    {
                      secuses: true,
                      profiles: [
                        {
                          id: 536380,
                          cid: 520688,
                          name: "Общий",
                          main: 1,
                          icon: "l_1",
                        },
                        {
                          id: 536831,
                          cid: 520688,
                          name: "New Name",
                          main: 0,
                          icon: "l_1",
                        },
                        {
                          id: 536880,
                          cid: 520688,
                          name: "New Profile Name",
                          main: 0,
                          icon: "l_1",
                        },
                      ],
                    },
                    null,
                    2,
                  )}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#profiles-change" && (
                <ApiEndpointDoc
                  title="Profiles Change"
                  description="Change an existing profile."
                  method="POST"
                  path="/profiles/change"
                  bodyParams={[
                    {
                      name: "id",
                      type: "integer",
                      description: "ID of the profile to change (required).",
                      defaultValue: "0",
                    },
                    {
                      name: "name",
                      type: "string",
                      description: "New name for the profile (required).",
                      defaultValue: "New Name",
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify({ success: true }, null, 2)}
                  errors={[
                    {
                      statusCode: 300,
                      description: "Error in data",
                    },
                  ]}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#profiles-create" && (
                <ApiEndpointDoc
                  title="Profiles Create"
                  description="Create a new profile."
                  method="POST"
                  path="/profiles/create"
                  bodyParams={[
                    {
                      name: "name",
                      type: "string",
                      description: "Name of the profile (required).",
                      defaultValue: "",
                    },
                  ]}
                  errors={[
                    {
                      statusCode: 300,
                      description: "Error in data.",
                    },
                    {
                      statusCode: 400,
                      description: "Maximum number of profiles created.",
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify(
                    {
                      secuses: true,
                      profile: {
                        id: 537503,
                        cid: 520688,
                        name: "DEMO",
                      },
                    },
                    null,
                    2,
                  )}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#profiles-remove" && (
                <ApiEndpointDoc
                  title="Profiles Remove"
                  description="Removes a user profile by ID."
                  method="POST"
                  path="/profiles/remove"
                  bodyParams={[
                    {
                      name: "id",
                      type: "integer",
                      description: "The ID of the profile to remove.",
                    },
                  ]}
                  exampleResponse={JSON.stringify(
                    { success: true, message: "Profile removed successfully." },
                    null,
                    2,
                  )}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#profiles-active" && (
                <ApiEndpointDoc
                  title="Profiles Active"
                  description="Sets the active profile for the authenticated user."
                  method="POST"
                  path="/profiles/active"
                  bodyParams={[
                    {
                      name: "id",
                      type: "integer",
                      description: "The ID of the profile to set as active.",
                    },
                  ]}
                  note_title="Authentication Required"
                  note_content="This API method requires user authentication."
                  exampleResponse={JSON.stringify(
                    {
                      success: true,
                      message: "Active profile updated successfully.",
                    },
                    null,
                    2,
                  )}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#reactions-add" && (
                <ApiEndpointDoc
                  title="Reactions Add"
                  description="Adds a reaction to content."
                  method="GET"
                  path="/reactions/add/:content_id/:type"
                  pathParams={[
                    {
                      name: "content_id",
                      type: "string",
                      description: "The ID of the content to react to.",
                    },
                    {
                      name: "type",
                      type: "string",
                      description: "The type of reaction.",
                      options: ["like", "dislike", "fire", "heart"],
                    },
                  ]}
                  note_title="Authentication Required"
                  note_content="This API method requires user authentication."
                  exampleResponse={JSON.stringify({ secuses: true }, null, 2)}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#reactions-get" && (
                <ApiEndpointDoc
                  title="Reactions Get"
                  description="Get reactions for specific content."
                  method="GET"
                  path="/reactions/get/{id}"
                  pathParams={[
                    {
                      name: "id",
                      type: "string",
                      description:
                        'Type + card ID, e.g., <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs cursor-pointer hover:bg-gray-200">movie_id</span> | <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs cursor-pointer hover:bg-gray-200">tv_id</span>.',
                      defaultValue: "tv_125988",
                    },
                  ]}
                  note_title="Authorization is not required for this API method."
                  note_content=""
                  exampleResponse={JSON.stringify(
                    {
                      secuses: true,
                      result: [
                        {
                          card_id: "tv_125988",
                          type: "think",
                          counter: 416,
                        },
                        {
                          card_id: "tv_125988",
                          type: "nice",
                          counter: 1434,
                        },
                        {
                          card_id: "tv_125988",
                          type: "fire",
                          counter: 6000,
                        },
                        {
                          card_id: "tv_125988",
                          type: "bore",
                          counter: 304,
                        },
                        {
                          card_id: "tv_125988",
                          type: "shit",
                          counter: 352,
                        },
                      ],
                    },
                    null,
                    2,
                  )}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={false}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#users-find" && (
                <ApiEndpointDoc
                  title="Users Find"
                  description="Find a user by email address."
                  method="GET"
                  path="/users/find"
                  queryParams={[
                    {
                      name: "email",
                      type: "string",
                      description: "User email (required).",
                      defaultValue: "test@example.com",
                    },
                  ]}
                  errors={[
                    {
                      statusCode: 400,
                      description: "Email cannot be empty.",
                    },
                    {
                      statusCode: 300,
                      description: "User not found.",
                    },
                  ]}
                  note_title="Authorization is not required for this API method."
                  note_content="" // Empty content for no authentication
                  exampleResponse={JSON.stringify(
                    { id: "user_id", email: "example@email.com" },
                    null,
                    2,
                  )}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={false}
                  dynamicEmailDefault={userEmail}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#users-get" && (
                <ApiEndpointDoc
                  title="Users Get"
                  description="Get information about the authenticated user."
                  method="GET"
                  path="/users/get"
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify(
                    {
                      secuses: true,
                      user: {
                        id: 1,
                        email: "dummy@example.com",
                        profile: 1,
                        telegram_id: 0,
                        telegram_chat: 0,
                        n_movie: 1,
                        n_tv: 1,
                        n_voice: 1,
                        premium: 0,
                        backup: 0,
                        permission: 0,
                        bet: "",
                        payout: 0,
                      },
                    },
                    null,
                    2,
                  )}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#users-give" && (
                <ApiEndpointDoc
                  title="Users Give"
                  description="Gift CUB Premium subscription to another user."
                  method="POST"
                  path="/users/give"
                  bodyParams={[
                    {
                      name: "to",
                      type: "integer",
                      description: "ID of the user to gift (required).",
                      defaultValue: "1",
                    },
                    {
                      name: "days",
                      type: "integer",
                      description:
                        'Number of days, minimum <span class="px-1 bg-[rgb(238,237,255)] text-[rgb(123,121,255)] rounded">5 days</span> (required).',
                      defaultValue: "30",
                    },
                    {
                      name: "password",
                      type: "string",
                      description: "Your password for confirmation (required).",
                      defaultValue: "password",
                    },
                  ]}
                  errors={[
                    {
                      statusCode: 455,
                      description: "Cannot gift to yourself.",
                    },
                    {
                      statusCode: 456,
                      description: "You do not have CUB Premium.",
                    },
                    {
                      statusCode: 457,
                      description: "Password does not match.",
                    },
                    {
                      statusCode: 458,
                      description: "Insufficient CUB Premium days.",
                    },
                    {
                      statusCode: 459,
                      description: "User not found.",
                    },
                  ]}
                  note_title="To access this API method, you need to be authorized."
                  note_content={
                    <>
                      To do this, please enter your token. If you don't have
                      one, you can{" "}
                      <a
                        href="#device-add"
                        className="underline text-[#aa566f]"
                      >
                        get it here
                      </a>
                      .
                    </>
                  }
                  exampleResponse={JSON.stringify({ success: true }, null, 2)}
                  token={token}
                  profile={profile}
                  setToken={setTokenAndCookie}
                  setProfile={setProfile}
                  requiresAuth={true}
                  defaultStatus={200}
                />
              )}

              {currentPage === "#add-device" && <AddDevicePage />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
