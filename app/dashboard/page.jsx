
'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import {
  Sparkles, Trash2, ExternalLink, Share2,
  Check, Lock, Globe, LayoutDashboard, Loader2
} from 'lucide-react';

function BoardCard({ board, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this board? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await fetch(`/api/boards?id=${board._id}`, { method: 'DELETE' });
      onDelete(board._id);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/board/${board._id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const accentColor = board.colors?.[0]?.hex || '#d946ef';

  return (
    <div className="glass-card overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      {}
      <div className="flex h-10">
        {board.colors?.slice(0, 6).map((color, i) => (
          <div
            key={i}
            className="flex-1 transition-all duration-300 group-hover:h-12"
            style={{ backgroundColor: color.hex, height: '40px' }}
          />
        ))}
      </div>

      <div className="p-5">
        {}
        <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize line-clamp-2 mb-2 leading-snug">
          "{board.prompt}"
        </h3>

        {}
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600">
            {board.isPublic
              ? <><Globe size={11} /> Public</>
              : <><Lock size={11} /> Private</>
            }
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-600">
            {new Date(board.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </span>
        </div>

        {}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {board.keywords?.slice(0, 4).map((kw) => (
            <span
              key={kw}
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                backgroundColor: accentColor + '15',
                color: accentColor,
                border: `1px solid ${accentColor}25`,
              }}
            >
              {kw}
            </span>
          ))}
        </div>

        {}
        <div className="flex items-center gap-2">
          <Link
            href={`/board/${board._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ExternalLink size={12} />
            View Board
          </Link>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {copied ? <Check size={12} className="text-green-500" /> : <Share2 size={12} />}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center justify-center py-2 px-3 rounded-xl text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBoards();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const fetchBoards = async () => {
    try {
      const res = await fetch('/api/boards');
      if (res.ok) {
        const data = await res.json();
        setBoards(data);
      }
    } catch (err) {
      console.error('Failed to fetch boards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (deletedId) => {
    setBoards(prev => prev.filter(b => b._id !== deletedId));
  };

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950/50 mb-6">
            <Lock size={32} className="text-brand-400" />
          </div>
          <h1 className="font-display text-3xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Sign in to view your boards
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Save and revisit all your AI-generated mood boards in one place.
          </p>
          <button onClick={() => signIn('google')} className="btn-primary mx-auto">
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard size={18} className="text-brand-500" />
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-600">
              My Collection
            </p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100">
            Your Mood Boards
          </h1>
          {boards.length > 0 && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {boards.length} board{boards.length !== 1 ? 's' : ''} saved
            </p>
          )}
        </div>

        <Link href="/" className="btn-primary self-start sm:self-auto">
          <Sparkles size={15} />
          Create New
        </Link>
      </div>

      {}
      {boards.length === 0 ? (
        <div className="text-center py-24">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gray-100 dark:bg-gray-800 mb-6">
            <Sparkles size={36} className="text-gray-300 dark:text-gray-700" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-gray-400 dark:text-gray-600 mb-3 italic">
            No boards yet
          </h2>
          <p className="text-gray-400 dark:text-gray-600 mb-8 max-w-sm mx-auto">
            Generate your first mood board and save it to see it here.
          </p>
          <Link href="/" className="btn-primary inline-flex">
            <Sparkles size={15} />
            Generate a Board
          </Link>
        </div>
      ) : (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {boards.map((board) => (
            <BoardCard
              key={board._id}
              board={board}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
