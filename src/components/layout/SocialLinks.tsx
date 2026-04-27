'use client';

export default function SocialLinks() {
  return (
    // FIXED SOCIAL LINK CONTAINER
    <div className="fixed bottom-10 right-10 z-50">
      {/* INSTAGRAM LINK BUTTON */}
      <a
        href="https://www.instagram.com/lithium_cloud/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform border border-zinc-200"
      >
        {/* INSTAGRAM ICON (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="white"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      </a>
    </div>
  );
}
