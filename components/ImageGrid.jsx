
'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export default function ImageGrid({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      {}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, index) => (
          <button
            key={img.unsplashId || index}
            onClick={() => setSelectedImage(img)}
            className="
              group relative aspect-[4/3] rounded-2xl overflow-hidden
              bg-gray-100 dark:bg-gray-800
              hover:shadow-xl hover:scale-[1.02]
              transition-all duration-300
            "
          >
            {}
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            {}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <p className="text-white text-xs font-medium line-clamp-2 text-left">
                {img.alt}
              </p>
            </div>
          </button>
        ))}
      </div>

      {}
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-600 text-center">
        Photos from{' '}
        <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer"
           className="underline hover:text-brand-500 transition-colors">
          Unsplash
        </a>
      </p>

      {}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selectedImage.url.replace('&w=400', '&w=1200')}
              alt={selectedImage.alt}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 flex items-end justify-between">
              <p className="text-white text-sm">{selectedImage.alt}</p>
              {selectedImage.unsplashId && (
                <a
                  href={`https://unsplash.com/photos/${selectedImage.unsplashId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white flex items-center gap-1 text-xs"
                >
                  <ExternalLink size={12} /> View on Unsplash
                </a>
              )}
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 text-white bg-black/50 hover:bg-black/70 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
