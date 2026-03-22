'use client';
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

interface ShareButtonProps {
  text: string;
  url: string;
  lang: string;
  labels?: {
    copied?: string;
    copy?: string;
  };
}

export const ShareButton = ({ text, url, lang, labels }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent('share_click', { platform: 'copy', lang });
    } catch {
      // fallback
      const el = document.createElement('input');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setOpen(false);
  };

  const shareTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    trackEvent('share_click', { platform: 'twitter', lang });
    setOpen(false);
  };

  // Web Share API
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: text, url });
        trackEvent('share_click', { platform: 'native', lang });
        return;
      } catch {}
    }
    setOpen((v) => !v);
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:border-orange-300 hover:text-orange-600 transition-colors"
        title={labels?.copy ?? '공유'}
      >
        {copied ? (
          <>✅ {labels?.copied ?? '복사됨'}</>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {labels?.copy ?? '공유'}
          </>
        )}
      </button>

      {/* 팝오버 (Web Share API 미지원 시) */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 flex flex-col gap-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg min-w-[130px]">
            <button
              onClick={shareTwitter}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              𝕏&nbsp; X(Twitter)
            </button>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              🔗&nbsp; {labels?.copy ?? '링크 복사'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
