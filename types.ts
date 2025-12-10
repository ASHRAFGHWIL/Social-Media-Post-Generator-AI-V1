export interface UserInput {
  description: string;
  productUrl: string;
  keyword: string;
  image: File | null;
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
  tiktok: string;
}

export interface FinalResult {
  posts: GeneratedSocialContent;
  images: Record<Platform, string>;
}


export type Platform = 'facebook' | 'instagram' | 'twitter' | 'pinterest' | 'linkedin' | 'vk' | 'youtube' | 'tiktok';

export type Language = 'ar' | 'en';

export const PLATFORM_CONFIG: Record<Platform, { name: string; icon: string; color: string }> = {
  facebook: { name: 'Facebook', icon: 'facebook', color: 'text-blue-600 dark:text-blue-400' },
  instagram: { name: 'Instagram', icon: 'instagram', color: 'text-pink-600 dark:text-pink-400' },
  twitter: { name: 'X (Twitter)', icon: 'twitter', color: 'text-gray-800 dark:text-gray-200' },
  linkedin: { name: 'LinkedIn', icon: 'linkedin', color: 'text-blue-700 dark:text-blue-500' },
  vk: { name: 'VK', icon: 'vk', color: 'text-blue-500 dark:text-blue-400' },
  pinterest: { name: 'Pinterest', icon: 'pinterest', color: 'text-red-600 dark:text-red-400' },
  youtube: { name: 'YouTube', icon: 'youtube', color: 'text-red-600 dark:text-red-500' },
  tiktok: { name: 'TikTok', icon: 'tiktok', color: 'text-gray-800 dark:text-white' },
};

export const PLATFORM_DIMENSIONS: Record<Platform, { width: number; height: number }> = {
  facebook: { width: 1080, height: 1080 }, // 1:1
  instagram: { width: 1080, height: 1080 }, // 1:1
  twitter: { width: 1600, height: 900 },   // 16:9
  linkedin: { width: 1200, height: 1200 }, // 1:1
  vk: { width: 1080, height: 1080 },       // 1:1
  pinterest: { width: 1000, height: 1500 },// 2:3
  youtube: { width: 1280, height: 720 },  // 16:9 (Thumbnail)
  tiktok: { width: 1080, height: 1920 },   // 9:16
};


export const UI_TEXT = {
  en: {
    title: 'Social Media AI Generator',
    subtitle: 'Create optimized posts and adapt your image for all platforms.',
    descPlaceholder: 'Enter detailed product description...',
    urlPlaceholder: 'Product Link (e.g., https://example.com)',
    keywordPlaceholder: 'Main Keyword (e.g., Digital Marketing)',
    uploadImage: 'Upload Post Image',
    changeImage: 'Change',
    removeImage: 'Remove',
    generateBtn: 'Generate & Adapt',
    generating: 'Generating...',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Download',
    clear: 'Clear',
    inputs: 'Inputs',
    results: 'Generated Results',
    error: 'Something went wrong. Please try again.',
    fillAll: 'Please fill in all fields, including the image.',
    pinterestTitle: 'Pin Title',
    pinterestDesc: 'Pin Description',
    youtubeTitle: 'Video Title',
    youtubeDesc: 'Video Description',
    words: 'Words',
    characters: 'Characters',
    apiKeyPrompt: 'This feature requires a paid API key.',
    apiKeyDescription: 'To generate images, please select an API key from a project with billing enabled.',
    selectApiKey: 'Select API Key',
    billingLink: 'Learn about billing',
    apiKeyInvalid: 'Your API Key is invalid or does not have permissions. Please select a new key.',
  },
  ar: {
    title: 'مولد محتوى التواصل الاجتماعي',
    subtitle: 'أنشئ منشورات احترافية وعدّل صورتك لتناسب جميع المنصات.',
    descPlaceholder: 'أدخل وصفاً تفصيلياً للمنتج...',
    urlPlaceholder: 'رابط المنتج (مثال: https://example.com)',
    keywordPlaceholder: 'الكلمة الرئيسية (مثال: تسويق رقمي)',
    uploadImage: 'ارفع صورة المنتج',
    changeImage: 'تغيير',
    removeImage: 'إزالة',
    generateBtn: 'توليد وتعديل',
    generating: 'جاري التوليد...',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    download: 'تحميل',
    clear: 'مسح',
    inputs: 'المدخلات',
    results: 'النتائج المولدة',
    error: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    fillAll: 'يرجى ملء جميع الحقول، بما في ذلك الصورة.',
    pinterestTitle: 'عنوان المنشور',
    pinterestDesc: 'وصف المنشور',
    youtubeTitle: 'عنوان الفيديو',
    youtubeDesc: 'وصف الفيديو',
    words: 'كلمة',
    characters: 'حرف',
    apiKeyPrompt: 'تتطلب هذه الميزة مفتاح API مدفوع.',
    apiKeyDescription: 'لتوليد الصور، يرجى اختيار مفتاح API من مشروع تم تفعيل الفوترة فيه.',
    selectApiKey: 'اختر مفتاح API',
    billingLink: 'تعرف على الفوترة',
    apiKeyInvalid: 'مفتاح API الخاص بك غير صالح أو لا يملك الأذونات. يرجى اختيار مفتاح جديد.',
  }
};