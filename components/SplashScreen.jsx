'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsClosing(true);
    }, 2000);

    const timer2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gray-950 transition-all duration-700 ease-in-out ${
        isClosing ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        {}
        <div className="relative group animate-[fadeUp_0.8s_ease-out_forwards]">
          {}
          <div className="absolute inset-0 rounded-3xl bg-brand-500/40 blur-3xl animate-pulse"></div>
          
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center shadow-2xl shadow-brand-500/40 relative z-10 animate-[bounce_3s_infinite_ease-in-out]">
            <Sparkles size={56} className="text-white drop-shadow-xl" />
          </div>
        </div>
        
        {}
        <div className="mt-10 text-center flex flex-col items-center overflow-hidden">
          <span className="font-display text-5xl sm:text-6xl font-semibold text-white tracking-wider animate-[fadeUp_1s_ease-out_0.2s_forwards] translate-y-8 opacity-0">
            Mood<span className="bg-gradient-to-r from-brand-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent italic">Board</span>
          </span>
          
          {}
          <div className="mt-6 flex gap-1.5 items-center justify-center opacity-0 animate-[fadeUp_1s_ease-out_0.4s_forwards]">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
