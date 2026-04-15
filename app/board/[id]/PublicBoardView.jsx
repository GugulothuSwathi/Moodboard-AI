
'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Share2, Check, Sparkles, ArrowLeft } from 'lucide-react';
import ColorSwatch from '../../../components/ColorSwatch';
import FontPreview from '../../../components/FontPreview';
import ImageGrid from '../../../components/ImageGrid';

export default function PublicBoardView({ board }) {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const accentColor = board.colors?.[0]?.hex || '#d946ef';

  return (
    <div className="min-h-screen pt-24 pb-20">
      {}
      <div className="flex h-2 w-full mb-0">
        {board.colors?.map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color.hex }} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">

        {}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to generator
        </Link>

        {}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">
              Mood Board
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-gray-100 capitalize leading-tight">
              "{board.prompt}"
            </h1>
            {board.designDirection && (
              <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                {board.designDirection}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={handleShare} className="btn-secondary text-sm py-2 px-4">
              {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
              {copied ? 'Link copied!' : 'Share'}
            </button>
            <Link href="/" className="btn-primary text-sm py-2 px-4">
              <Sparkles size={14} />
              Make yours
            </Link>
          </div>
        </div>

        {}
        <div className="mb-10">
          <SectionLabel>Color Palette</SectionLabel>
          <ColorSwatch colors={board.colors} />
          {}
          <div className="flex mt-2">
            {board.colors?.map((c) => (
              <div key={c.hex} className="flex-1 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-600 truncate px-1">{c.name}</p>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="glass-card p-6">
            <SectionLabel>Mood & Keywords</SectionLabel>
            <div className="flex flex-wrap gap-2 mt-4">
              {board.keywords?.map((keyword, i) => (
                <span
                  key={keyword}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: board.colors?.[i % board.colors.length]?.hex + '18',
                    color: board.colors?.[i % board.colors.length]?.hex,
                    border: `1px solid ${board.colors?.[i % board.colors.length]?.hex + '30'}`,
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <SectionLabel>Textures & Materials</SectionLabel>
            <ul className="mt-4 space-y-2.5">
              {board.textures?.map((texture, i) => (
                <li key={texture} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: board.colors?.[i % board.colors.length]?.hex }}
                  />
                  {texture}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {}
        <div className="mb-10">
          <SectionLabel>Font Pairings</SectionLabel>
          <FontPreview fonts={board.fonts} />
        </div>

        {}
        {board.images?.length > 0 && (
          <div className="mb-10">
            <SectionLabel>Reference Images</SectionLabel>
            <ImageGrid images={board.images} />
          </div>
        )}

        {}
        <div className="mt-16 text-center py-16 border-t border-gray-100 dark:border-gray-800">
          <p className="font-display text-2xl italic text-gray-400 dark:text-gray-600 mb-6">
            Like what you see? Make your own.
          </p>
          <Link href="/" className="btn-primary inline-flex text-base px-8 py-4">
            <Sparkles size={18} />
            Try MoodBoard AI — it's free
          </Link>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">
      {children}
    </h2>
  );
}
