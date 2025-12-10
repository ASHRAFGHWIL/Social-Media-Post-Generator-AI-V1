export interface UserInput {
  description: string;
  productUrl: string;
  keyword: string;
}

export interface PinterestContent {
  title: string;
  description: string;
}

export interface YoutubeContent {
  title: string;
  description: string;
}

export interface GeneratedSocialContent {
  facebook: string;
  instagram: string;
  twitter: string; // X
  linkedin: string;
  vk: string;
  pinterest: PinterestContent;
  youtube: YoutubeContent;
}

export type Platform = 'facebook' | 'instagram' | 'twitter' | 'pinterest' | 'linkedin' | 'vk' | 'youtube';

export type Language = 'ar' | 'en';

export const PLATFORM_CONFIG: Record<Platform, { name: string; icon: string; color: string }> = {
  facebook: { name: 'Facebook', icon: 'facebook', color: 'text-blue-600 dark:text-blue-400' },
  instagram: { name: 'Instagram', icon: 'instagram', color: 'text-pink-600 dark:text-pink-400' },
  twitter: { name: 'X (Twitter)', icon: 'twitter', color: 'text-gray-800 dark:text-gray-200' },
  linkedin: { name: 'LinkedIn', icon: 'linkedin', color: 'text-blue-700 dark:text-blue-500' },
  vk: { name: 'VK', icon: 'vk', color: 'text-blue-500 dark:text-blue-400' },
  pinterest: { name: 'Pinterest', icon: 'pinterest', color: 'text-red-600 dark:text-red-400' },
  youtube: { name: 'YouTube', icon: 'youtube', color: 'text-red-600 dark:text-red-500' },
};

export const UI_TEXT = {
  en: {
    title: 'Social Media AI Generator',
    subtitle: 'Create optimized posts for all platforms in seconds.',
    descPlaceholder: 'Enter detailed product description...',
    urlPlaceholder: 'Product Link (e.g., https://example.com)',
    keywordPlaceholder: 'Main Keyword (e.g., Digital Marketing)',
    generateBtn: 'Generate Posts',
    generating: 'Generating...',
    copy: 'Copy',
    copied: 'Copied!',
    clear: 'Clear',
    inputs: 'Inputs',
    results: 'Generated Results',
    error: 'Something went wrong. Please try again.',
    fillAll: 'Please fill in all fields.',
    pinterestTitle: 'Pin Title',
    pinterestDesc: 'Pin Description',
    youtubeTitle: 'Video Title',
    youtubeDesc: 'Video Description',
    words: 'Words',
    characters: 'Characters',
  },
  ar: {
    title: 'مولد محتوى التواصل الاجتماعي',
    subtitle: 'أنشئ منشورات احترافية لجميع المنصات في ثوانٍ.',
    descPlaceholder: 'أدخل وصفاً تفصيلياً للمنتج...',
    urlPlaceholder: 'رابط المنتج (مثال: https://example.com)',
    keywordPlaceholder: 'الكلمة الرئيسية (مثال: تسويق رقمي)',
    generateBtn: 'توليد المنشورات',
    generating: 'جاري التوليد...',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    clear: 'مسح',
    inputs: 'المدخلات',
    results: 'النتائج المولدة',
    error: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    fillAll: 'يرجى ملء جميع الحقول.',
    pinterestTitle: 'عنوان المنشور',
    pinterestDesc: 'وصف المنشور',
    youtubeTitle: 'عنوان الفيديو',
    youtubeDesc: 'وصف الفيديو',
    words: 'كلمة',
    characters: 'حرف',
  }
};