import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Languages, Sparkles, AlertCircle, Eraser, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { UI_TEXT, Language, UserInput, FinalResult, Platform } from './types';
import { generateContent } from './services/geminiService';
import PostCard from './components/PostCard';

const App: React.FC = () => {
  // State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<Language>('ar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [input, setInput] = useState<UserInput>({
    description: '',
    productUrl: '',
    keyword: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [result, setResult] = useState<FinalResult | null>(null);

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Theme Toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setInput(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleClear = () => {
    setInput({ description: '', productUrl: '', keyword: '', image: null });
    handleRemoveImage();
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!input.description || !input.keyword || !input.productUrl || !input.image) {
      setError(UI_TEXT[lang].fillAll);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await generateContent(input, lang);
      setResult(data);
    } catch (err) {
      setError(UI_TEXT[lang].error);
    } finally {
      setLoading(false);
    }
  };

  const t = UI_TEXT[lang];
  const isRtl = lang === 'ar';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen font-sans bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
                SocialGenAI
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors flex items-center gap-1 font-semibold text-sm">
                <Languages className="w-4 h-4" />
                <span>{lang === 'en' ? 'AR' : 'EN'}</span>
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{t.title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t.inputs}</h3>
                <button onClick={handleClear} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
                   <Eraser className="w-3 h-3" /> {t.clear}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.uploadImage}</label>
                  {imagePreview ? (
                     <div className="relative group">
                        <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-white text-xs bg-white/20 hover:bg-white/30 p-2 rounded-lg mx-1">{t.changeImage}</button>
                            <button type="button" onClick={handleRemoveImage} className="text-white text-xs bg-white/20 hover:bg-white/30 p-2 rounded-lg mx-1">{t.removeImage}</button>
                        </div>
                     </div>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-40 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <UploadCloud className="w-8 h-8 mb-2" />
                      <span className="text-sm font-semibold">{isRtl ? 'انقر للرفع' : 'Click to upload'}</span>
                    </button>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.descPlaceholder}</label>
                  <textarea name="description" value={input.description} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400" placeholder="..."/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.urlPlaceholder}</label>
                  <input type="url" name="productUrl" value={input.productUrl} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400" placeholder="https://..."/>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.keywordPlaceholder}</label>
                  <input type="text" name="keyword" value={input.keyword} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400" placeholder="SEO Keyword"/>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className={`w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500'}`}>
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span>{t.generating}</span></>
                  ) : (
                    <><Sparkles className="w-5 h-5" /><span>{t.generateBtn}</span></>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {!result && !loading && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-800/30">
                 <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                 </div>
                 <p className="font-medium">{isRtl ? 'املأ الحقول وارفع صورة لبدء السحر...' : 'Fill the fields & upload an image to start...'}</p>
              </div>
            )}

            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                {(Object.keys(result.images) as Platform[]).map(platform => (
                  <PostCard 
                    key={platform}
                    platform={platform}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    content={result.posts[platform]} 
                    imageUrl={result.images[platform]} 
                    keyword={input.keyword} 
                    lang={lang} 
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
      
      <footer className="mt-12 py-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-800">
         <p className="text-sm">© {new Date().getFullYear()} SocialGenAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;