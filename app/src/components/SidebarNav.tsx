import React from 'react';

interface SidebarNavProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const navItems = [
  {
    category: 'BOOKMARKS',
    links: [
      { hash: '#bookmarks-all', text: 'all', description: 'All bookmarks' },
      { hash: '#bookmarks-add', text: 'add', description: 'Add' },
      { hash: '#bookmarks-remove', text: 'remove', description: 'Remove' },
    ],
  },
  {
    category: 'CARD',
    links: [
      { hash: '#card-season', text: 'season', description: 'Season' },
      { hash: '#card-subscribed', text: 'subscribed', description: 'Subscription' },
      { hash: '#card-translations', text: 'translations', description: 'Translations' },
      { hash: '#card-unsubscribe', text: 'unsubscribe', description: 'Unsubscribe' },
    ],
  },
  {
    category: 'DEVICE',
    links: [
      { hash: '#device-add', text: 'add', description: 'Authorize' },
      { hash: '#add-device', text: 'generate', description: 'Generate Code' },
    ],
  },
  {
    category: 'NOTICE',
    links: [
      { hash: '#notice-all', text: 'all', description: 'Get notifications' },
      { hash: '#notice-clear', text: 'clear', description: 'Clear' },
    ],
  },
  {
    category: 'NOTIFICATIONS',
    links: [{ hash: '#notifications-all', text: 'all', description: 'Get' },
    { hash: '#notifications-add', text: 'add', description: 'Add' },
    { hash: '#notifications-remove', text: 'remove', description: 'Remove' },
    { hash: '#notifications-status', text: 'status', description: 'Status' },
    ],
  },
  {
    category: 'TIMELINE',
    links: [{ hash: '#timeline-all', text: 'all', description: 'Get all timeline data' }],
  },
  {
    category: 'PROFILES',
    links: [{ hash: '#profiles-all', text: 'all', description: 'All profiles' },
    { hash: '#profiles-change', text: 'change', description: 'Change' },
    { hash: '#profiles-create', text: 'create', description: 'Create' },
    { hash: '#profiles-remove', text: 'remove', description: 'Remove' },
    { hash: '#profiles-active', text: 'active', description: 'Set active profile' },
    ],
  },
  {
    category: 'REACTIONS',
    links: [{ hash: '#reactions-add', text: 'add', description: 'React' },
    { hash: '#reactions-get', text: 'get', description: 'Get' },
    ],
  },
  {
    category: 'USERS',
    links: [{ hash: '#users-find', text: 'find', description: 'Find user' },
    { hash: '#users-get', text: 'get', description: 'Get info' },
    { hash: '#users-give', text: 'give', description: 'Give CUB Premium' },
    ],
  },
];

const SidebarNav: React.FC<SidebarNavProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <aside className="border-r border-[55#c8c9c8] py-8 px-16 bg-white/60">
      <nav aria-label="Main menu">
        <ul className="space-y-2">
          <li>
            <a
              href="#home"
              className={`font-semibold ${currentPage === '#home' ? 'text-green-600 border-l-4 border-green-600 pl-2 -ml-4' : ''}`}
              onClick={() => setCurrentPage('#home')}
            >
              Home
            </a>
          </li>
        </ul>
        <div className="mt-6 space-y-4">
          {navItems.map((item) => (
            <div key={item.category}>
              <div className="font-bold uppercase text-sm text-[#999998] mb-1 tracking-wider">{item.category}</div>
              <ul className="space-y-1">
                {item.links.map((link) => (
                  <li key={link.hash}>
                    <a
                      href={link.hash}
                      className={`flex flex-wrap items-baseline py-1 ${currentPage === link.hash ? 'text-green-600 border-l-4 border-green-600 pl-2 -ml-4' : 'hover:bg-gray-100'}`}
                      onClick={() => setCurrentPage(link.hash)}
                    >
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-800">{link.text}</span> <span className="text-gray-500 text-xs ml-2">– {link.description}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default SidebarNav; 