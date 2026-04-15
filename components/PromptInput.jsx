
'use client';

import { useState, useRef } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function PromptInput({ onGenerate, isLoading }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim() && !isLoading) {
      onGenerate(value.trim());
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className={`
        relative rounded-3xl border-2 transition-all duration-300
        ${isLoading
          ? 'border-brand-300 dark:border-brand-700 shadow-xl shadow-brand-500/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 focus-within:border-brand-400 dark:focus-within:border-brand-600 focus-within:shadow-xl focus-within:shadow-brand-500/15'
        }
        bg-white dark:bg-gray-900
      `}>

        {}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe your creative concept... e.g. 'minimalist Japanese tea house'"
          disabled={isLoading}
          rows={1}
          className="
            w-full px-6 pt-5 pb-16
            bg-transparent resize-none outline-none
            font-body text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-600
            text-base sm:text-lg
            disabled:opacity-60
            rounded-3xl
          "
          style={{ minHeight: '80px', maxHeight: '200px' }}
        />

        {}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 flex items-center justify-between">

          {}
          <div className="flex items-center gap-3">
            <span className={`text-xs font-mono transition-colors ${
              value.length > 200 ? 'text-red-400' : 'text-gray-400 dark:text-gray-600'
            }`}>
              {value.length}/250
            </span>
            <span className="hidden sm:block text-xs text-gray-300 dark:text-gray-700">
              ⌘ + Enter to generate
            </span>
          </div>

          {}
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || isLoading}
            className="btn-primary py-2.5 px-5 text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Generate Board
              </>
            )}
          </button>
        </div>
      </div>

      {}
      {isLoading && (
        <div className="mt-4 text-center animate-fade-in">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ✨ AI is crafting your mood board — usually takes 5-10 seconds...
          </p>
          {}
          <div className="flex justify-center gap-1.5 mt-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
