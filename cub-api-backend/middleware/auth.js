const jwt = require("jsonwebtoken");
const { Magic } = require("@magic-sdk/admin");

const authenticateToken = (req, res, next) => {
  console.log('[AuthMiddleware] Cookies received:', req.headers.cookie);
  console.log('[AuthMiddleware] Token header received:', req.header("Token"));
  let token = req.header("Token"); // Try header first
  const profileId = req.header("Profile"); // Profile header

  // If not in header, try cookie
  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|; )token=([^;]*)/);
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }
  console.log('[AuthMiddleware] Token extracted for processing:', token);

  if (!token) {
    return res
      .status(401)
      .json({ error: true, code: 700, text: "Access token is required." });
  }

  try {
    // Support new custom token format: <base64url-encoded JSON>.<base64url signature>
    const parts = token.split(".");
    if (parts.length !== 2) {
      throw new Error("Invalid token format");
    }
    const payloadB64 = parts[0];
    console.log('[AuthMiddleware] payloadB64:', payloadB64);
    const payloadStr = Buffer.from(payloadB64, "base64url").toString("utf8");
    console.log('[AuthMiddleware] payloadStr:', payloadStr);
    const payload = JSON.parse(payloadStr);
    console.log('[AuthMiddleware] Parsed payload:', payload);
    if (!payload.id) {
      throw new Error("Invalid token payload");
    }
    req.user = { id: payload.id };
    req.profileId = profileId;
    next();
  } catch (err) {
    console.error('[AuthMiddleware] Error during token processing:', err);
    return res
      .status(403)
      .json({ error: true, code: 700, text: "Invalid or expired token." });
  }
};

// Magic Link authentication middleware
const magic = new Magic(process.env.MAGIC_SECRET_KEY || "");

const authenticateMagicUser = async (req, res, next) => {
  try {
    let authHeader = req.header("Authorization") || req.header("authorization");
    let didToken = null;

    if (authHeader) {
      if (authHeader.toLowerCase().startsWith("bearer ")) {
        didToken = authHeader.substring(7);
      } else {
        didToken = authHeader;
      }
    }

    if (!didToken) {
      return res.status(401).json({
        error: true,
        code: 701,
        text: "Magic Link DID token is required.",
      });
    }

    // Check if MAGIC_SECRET_KEY is set
    if (!process.env.MAGIC_SECRET_KEY) {
      console.error("MAGIC_SECRET_KEY is not set in environment variables!");
      return res
        .status(500)
        .json({
          error: true,
          code: 704,
          text: "Internal server error: MAGIC_SECRET_KEY not set.",
        });
    }

    // Validate the DID token
    console.log("Validating DID token:", didToken);
    try {
      await magic.token.validate(didToken);
    } catch (validationErr) {
      console.error("DID token validation failed:", validationErr);
      return res
        .status(403)
        .json({
          error: true,
          code: 703,
          text: "Invalid or expired Magic Link token.",
        });
    }
    console.log("DID token validation successful.");
    const localMagic = new Magic(process.env.MAGIC_SECRET_KEY || "");
    let metadata;
    try {
      metadata = await localMagic.users.getMetadataByToken(didToken);
    } catch (metadataErr) {
      console.error("Error fetching metadata from Magic Link:", metadataErr);
      return res
        .status(401)
        .json({
          error: true,
          code: 705,
          text: "Invalid Magic Link user or problem fetching metadata.",
        });
    }

    if (!metadata || !metadata.email) {
      return res
        .status(401)
        .json({ error: true, code: 702, text: "Invalid Magic Link user." });
    }
    req.user = { email: metadata.email };
    next();
  } catch (err) {
    console.error("DID token validation failed:", err);
    return res.status(403).json({
      error: true,
      code: 703,
      text: "Invalid or expired Magic Link token.",
    });
  }
};

module.exports = authenticateToken;
module.exports.authenticateMagicUser = authenticateMagicUser;
