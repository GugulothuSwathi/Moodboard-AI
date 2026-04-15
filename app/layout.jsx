
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { AuthProvider } from '../components/AuthProvider';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'MoodBoard AI — Generate Beautiful Creative Boards',
  description: 'Type any creative concept and get an instant mood board with colors, fonts, and images powered by AI.',
  openGraph: {
    title: 'MoodBoard AI',
    description: 'AI-powered mood board generator for creatives',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      { }
      <head>
        { }
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        { }
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <footer className="border-t border-gray-100 dark:border-gray-800 py-8 mt-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="font-display text-xl text-gray-400 dark:text-gray-600">
                  MoodBoard <span className="text-brand-500">AI</span>
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-600">
                  Powered by OpenAI & Unsplash
                  {' · '}
                  <a href="mailto:gugulothuswathi119@gmail.com" className="hover:text-purple-500 transition-colors">
                    gugulothuswathi119@gmail.com
                  </a>
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
