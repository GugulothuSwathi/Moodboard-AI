
'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function ColorSwatch({ colors }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!colors || colors.length === 0) return null;

  const copyHex = async (hex, index) => {
    await navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="flex h-24 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
      {colors.map((color, index) => (
        <button
          key={color.hex}
          onClick={() => copyHex(color.hex, index)}
          className="color-swatch flex-1 relative group flex flex-col items-center justify-end pb-2 cursor-pointer"
          style={{ backgroundColor: color.hex }}
          title={`${color.name} — ${color.hex} (click to copy)`}
        >
          {}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {copiedIndex === index
                ? <Check size={16} className="text-white drop-shadow" />
                : <Copy size={14} className="text-white drop-shadow" />
              }
            </div>
          </div>

          {}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center z-10">
            <p className="text-white text-xs font-mono drop-shadow font-medium leading-tight">
              {color.hex}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
  {}
  return (
    <div>
      <div className="flex h-24 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
        {}
      </div>
      <div className="flex mt-2">
        {colors.map((color) => (
          <div key={color.hex} className="flex-1 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500 truncate px-1">{color.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
