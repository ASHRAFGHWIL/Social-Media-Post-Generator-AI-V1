import React, { useState, useMemo } from 'react';
import { Copy, Check, Facebook, Instagram, Twitter, MessageCircle, Linkedin, Youtube, Download } from 'lucide-react';
import { PLATFORM_CONFIG, Platform, UI_TEXT, Language, PLATFORM_DIMENSIONS } from '../types';

interface PostCardProps {
  platform: Platform;
  content: string | { title: string; description: string };
  keyword: string;
  lang: Language;
  imageUrl: string | null;
}

const PostCard: React.FC<PostCardProps> = ({ platform, content, keyword, lang, imageUrl }) => {
  const [copied, setCopied] = useState(false);
  const config = PLATFORM_CONFIG[platform];
  const t = UI_TEXT[lang];
  const [imageLoaded, setImageLoaded] = useState(false);
  const dimensions = PLATFORM_DIMENSIONS[platform];

  const { textToCopy, wordCount, charCount } = useMemo(() => {
    const text = typeof content === 'string' 
      ? content 
      : `${content.title || ''}\n\n${content.description || ''}`;
    
    const words = text.trim().split(/\s+/).filter(Boolean);

    return {
      textToCopy: text,
      wordCount: text.trim() ? words.length : 0,
      charCount: text.length,
    };
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };
  
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    const fileType = imageUrl.split(';')[0].split('/')[1] || 'png';
    link.download = `socialgenai-${platform}-image.${fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderIcon = () => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      case 'tiktok': return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.94-6.37-2.96-2.24-2.95-2.23-6.42-.02-9.38 1.15-1.55 2.7-2.78 4.35-3.54.04 2.14-.02 4.28-.02 6.42 0 1.22.38 2.35 1.04 3.33.69 1.04 1.74 1.84 2.96 2.03 2.05.32 3.99-.99 4.35-2.98.04-.23.05-.46.05-.69V7.61c-1.35.29-2.69.45-4.03.46-1.52 0-2.9-.31-4.25-1.1-1.28-.74-2.3-1.84-2.89-3.13-.59-1.29-.8-2.75-.7-4.22.09-1.42.49-2.84 1.18-4.13.51-.95 1.17-1.83 1.95-2.6C10.79.43 11.64 0 12.53.02z" />
        </svg>
      );
      case 'vk': return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zM17.6 13.84c.32.32.74.74 1.05 1.05.51.51.51.68 0 1.18-.34.34-1.09.34-1.09.34l-2.54.02c-.89 0-1.47-.48-1.74-1.02-.27-.55-.55-1.02-1.09-1.31-.3-.15-.65-.15-.9.08-.26.23-.33.65-.33 1.02 0 .42.15 1.2.78 1.62.33.22.21.72-.56.77-3.92.2-6.39-2.73-8.31-7.44-.22-.53 0-.89.65-.89h2.6c.46 0 .72.15.9.61.94 2.8 2.47 5.17 3.25 5.17.26 0 .39-.26.39-.72 0-1.84-1.04-2.61-1.04-3.64 0-.82.63-1.18 1.57-1.25.32-.02.73 0 1.06.09.4.15.22.8.06 1.13-.3.62-.71 1.58-.16 1.94.27.18.66.18 1.12-.62.72-1.2 1.2-2.6 1.26-3.55 0-.32.41-.42.79-.42h2.5c.72 0 .9.42.72 1.04-.33 1.45-1.53 4.23-3.19 6.16z" />
        </svg>
      );
      case 'pinterest': return <div className="font-bold text-lg leading-none">P</div>;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  const getLabels = () => {
    if (platform === 'pinterest') return { title: t.pinterestTitle, desc: t.pinterestDesc };
    if (platform === 'youtube') return { title: t.youtubeTitle, desc: t.youtubeDesc };
    return { title: 'Title', desc: 'Description' };
  };

  const labels = getLabels();

  const HighlightedText = ({ text }: { text: string }) => {
    if (!text) return null;
    const parts = text.split(/(\s+)/); 
    return (
      <span className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
        {parts.map((part, index) => {
          const lowerPart = part.toLowerCase();
          const lowerKeyword = keyword.toLowerCase().trim();
          if (part.trim().startsWith('#')) {
            return <span key={index} className="text-blue-600 dark:text-blue-400 font-medium">{part}</span>;
          }
          if (lowerKeyword && lowerPart.includes(lowerKeyword)) {
             return <span key={index} className="text-orange-600 dark:text-orange-400 font-bold bg-orange-100 dark:bg-orange-900/30 px-0.5 rounded">{part}</span>;
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-brand-500/30 flex flex-col">
      <div className="flex-grow">
        {imageUrl && (
            <div 
              className="relative group bg-gray-100 dark:bg-slate-700"
              style={{ aspectRatio: `${dimensions.width} / ${dimensions.height}` }}
            >
                {!imageLoaded && <div className="absolute inset-0 bg-gray-200 dark:bg-slate-700 animate-pulse"></div>}
                <img 
                    src={imageUrl} 
                    alt={`${config.name} post image`} 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        <span>{t.download}</span>
                    </button>
                </div>
            </div>
        )}

        <div className={`px-4 py-3 border-b ${imageUrl ? 'border-t' : ''} border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50`}>
          <div className={`flex items-center gap-2 font-bold text-lg ${config.color}`}>
            {renderIcon()}
            <span>{config.name}</span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200
              ${copied 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-brand-600 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-600'
              }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t.copied : t.copy}</span>
          </button>
        </div>

        <div className="p-5 text-gray-700 dark:text-gray-300 relative">
          {typeof content === 'string' ? (
            <HighlightedText text={content} />
          ) : (
            <div className="space-y-4">
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">{labels.title}</span>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-2 border-l-4 border-red-500 pl-3">
                  <HighlightedText text={content.title} />
                </div>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-gray-400 mb-1 font-bold">{labels.desc}</span>
                <HighlightedText text={content.description} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end gap-4">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-gray-600 dark:text-gray-300 tabular-nums">{wordCount}</span>
          <span>{t.words}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-gray-600 dark:text-gray-300 tabular-nums">{charCount}</span>
          <span>{t.characters}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;