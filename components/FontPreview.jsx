
'use client';

import { useEffect, useState } from 'react';

export default function FontPreview({ fonts }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!fonts || fonts.length === 0) return;

    const validFonts = fonts.filter(f => f && f.name);
    if (validFonts.length === 0) return;

    const fontNames = validFonts.map(f => f.name.replace(/ /g, '+')).join('&family=');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontNames}:wght@300;400;500;600;700&display=swap`;
    link.onload = () => setLoaded(true);
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [fonts]);

  if (!fonts || fonts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {fonts.map((font, index) => (
        <div
          key={font.name}
          className="glass-card p-6 hover:shadow-md transition-shadow"
        >
          {}
          <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">
            {font.role}
          </p>

          {}
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            {font.name}
          </p>

          {}
          {}
          <div
            style={{ fontFamily: `'${font.name}', serif` }}
            className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          >
            {}
            {font.role === 'heading' || font.role === 'display' ? (
              <>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 leading-tight mb-1">
                  The quick brown fox
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Aa Bb Cc Dd Ee
                </p>
              </>
            ) : (
              <>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-1">
                  The quick brown fox jumps over the lazy dog.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  1 2 3 4 5 6 7 8 9 0
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
