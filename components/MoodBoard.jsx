'use client';

import { useState, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Save, Share2, Check, Loader2, Download } from 'lucide-react';
import ColorSwatch from './ColorSwatch';
import FontPreview from './FontPreview';
import ImageGrid from './ImageGrid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function MoodBoardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl w-64 mb-2" />
          <div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg w-40" />
        </div>
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-2xl w-32" />
      </div>

      <div className="mb-8">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-4" />
        <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
        <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function MoodBoard({ data, prompt, isLoading }) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  const boardRef = useRef(null);

  if (isLoading) return <MoodBoardSkeleton />;
  if (!data) return null;

  const { colors, fonts, keywords, textures, images } = data;

  const handleSave = async () => {
    if (!session) {
      signIn('google');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...data, isPublic: false }),
      });

      if (response.ok) {
        const savedBoard = await response.json();
        setSaved(true);
        setShareUrl(`${window.location.origin}/board/${savedBoard._id}`);
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!shareUrl) {
      await handleSave();
      return;
    }
    
    setSharing(true);
    let sharedSuccessfully = false;

    if (navigator.share && navigator.canShare && boardRef.current) {
      try {
        const element = boardRef.current;
        const originalScroll = window.scrollY;
        window.scrollTo(0, 0);
        document.body.classList.add('export-mode');

        const canvas = await html2canvas(element, { 
          scale: 2, 
          useCORS: true, 
          allowTaint: true,
          scrollY: 0,
          backgroundColor: document.documentElement.classList.contains('dark') ? '#030712' : '#ffffff' 
        });

        document.body.classList.remove('export-mode');
        window.scrollTo(0, originalScroll);

        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const file = new File([blob], 'moodboard.png', { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `MoodBoard AI — "${prompt}"`,
            text: `Check out this AI mood board for "${prompt}"!`,
            files: [file]
          });
        } else {
          await navigator.share({
            title: `MoodBoard AI — "${prompt}"`,
            text: `Check out this AI-generated mood board for "${prompt}"`,
            url: shareUrl,
          });
        }
        sharedSuccessfully = true;
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Share failed:', err);
      }
    } else if (navigator.share) {
       try {
         await navigator.share({
            title: `MoodBoard AI — "${prompt}"`,
            text: `Check out this AI-generated mood board for "${prompt}"`,
            url: shareUrl,
          });
          sharedSuccessfully = true;
       } catch (err) {
         if (err.name !== 'AbortError') console.error('Share failed:', err);
       }
    }

    setSharing(false);

    if (!sharedSuccessfully) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportPDF = async () => {
    if (!boardRef.current) return;
    setExporting(true);
    try {
      const element = boardRef.current;
      
      const originalScroll = window.scrollY;
      window.scrollTo(0, 0);
      document.body.classList.add('export-mode');

      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        allowTaint: true,
        scrollY: 0,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#030712' : '#ffffff' 
      });
      
      document.body.classList.remove('export-mode');
      window.scrollTo(0, originalScroll);

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      const safePrompt = prompt ? prompt.replace(/\s+/g, '-').toLowerCase() : 'board';
      pdf.save(`moodboard-${safePrompt}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="animate-fade-in">

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">
            Mood Board for
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 capitalize">
            "{prompt}"
          </h2>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <button 
            onClick={handleExportPDF} 
            disabled={exporting || isLoading}
            className="btn-secondary text-sm py-2 px-4"
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>

          {saved && shareUrl && (
            <button onClick={handleShare} disabled={sharing} className="btn-secondary text-sm py-2 px-4">
              {sharing ? <Loader2 size={14} className="animate-spin" /> : copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
              {sharing ? 'Processing...' : copied ? 'Copied!' : 'Share'}
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={saved ? 'btn-secondary text-sm py-2 px-4' : 'btn-primary text-sm py-2 px-4'}
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" /> Saving...</>
            ) : saved ? (
              <><Check size={14} className="text-green-500" /> Saved!</>
            ) : (
              <><Save size={14} /> {session ? 'Save' : 'Sign in to Save'}</>
            )}
          </button>
        </div>
      </div>

      <div ref={boardRef} className="p-2 sm:p-4 -m-2 sm:-m-4 rounded-xl">
        {colors && colors.length > 0 && (
          <div className="board-item mb-8">
            <SectionLabel>Color Palette</SectionLabel>
            <ColorSwatch colors={colors} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          <div className="board-item glass-card p-6 min-h-[160px]">
             <SectionLabel>Mood & Keywords</SectionLabel>
             <div className="flex flex-wrap gap-2 mt-4">
               {keywords?.map((keyword, i) => {
                 const color = colors?.[i % colors.length]?.hex || '#6b7280';
                 return (
                 <span
                   key={`${keyword}-${i}`}
                   className="px-3 py-1.5 rounded-full text-sm font-medium"
                   style={{
                     backgroundColor: color + '18',
                     color: color,
                     border: `1px solid ${color}30`,
                   }}
                 >
                   {keyword}
                 </span>
               )})}
             </div>
          </div>

          <div className="board-item glass-card p-6 min-h-[160px]">
            <SectionLabel>Textures & Materials</SectionLabel>
            <ul className="mt-4 space-y-2">
              {textures?.map((texture, i) => (
                <li key={`${texture}-${i}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors?.[i % colors.length]?.hex || '#d1d5db' }}
                  />
                  {texture}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {fonts && fonts.length > 0 && (
          <div className="board-item mb-8">
            <SectionLabel>Font Pairings</SectionLabel>
            <FontPreview fonts={fonts} />
          </div>
        )}

        {images && images.length > 0 && (
          <div className="board-item">
            <SectionLabel>Reference Images</SectionLabel>
            <ImageGrid images={images} />
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">
      {children}
    </h3>
  );
}
