import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedSocialContent, UserInput, FinalResult, PLATFORM_DIMENSIONS, Platform } from "../types";

const resizeImage = (file: File, width: number, height: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }

        // Smart center-crop logic
        const sourceWidth = img.width;
        const sourceHeight = img.height;
        const sourceAspectRatio = sourceWidth / sourceHeight;
        const targetAspectRatio = width / height;
        let sx = 0, sy = 0, sWidth = sourceWidth, sHeight = sourceHeight;

        if (sourceAspectRatio > targetAspectRatio) { // Source image is wider than target
          sWidth = sourceHeight * targetAspectRatio;
          sx = (sourceWidth - sWidth) / 2;
        } else if (sourceAspectRatio < targetAspectRatio) { // Source image is taller than target
          sHeight = sourceWidth / targetAspectRatio;
          sy = (sourceHeight - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);
        resolve(canvas.toDataURL(file.type));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};


const getTextSchema = () => {
  return {
    type: Type.OBJECT,
    properties: {
      facebook: {
        type: Type.STRING,
        description: "Optimized Facebook post with emojis, engaging text, call to action, and the product link.",
      },
      instagram: {
        type: Type.STRING,
        description: "Optimized Instagram caption with a strong visual hook, emojis, a clear call to action (e.g., 'Link in Bio'), and 15-20 relevant hashtags. IMPORTANT: Do NOT include the product URL directly in the caption.",
      },
      twitter: {
        type: Type.STRING,
        description: "Optimized X (Twitter) post, short, punchy (MUST NOT exceed 300 characters), emojis, hashtags, and the product link.",
      },
      linkedin: {
        type: Type.STRING,
        description: "Professional LinkedIn post. Corporate/Business tone, focus on value proposition, professional emojis, 3-5 relevant hashtags, and product link.",
      },
      vk: {
        type: Type.STRING,
        description: "Optimized VK (VKontakte) post. Similar to Facebook but adapted for the platform culture. Engaging, informative, emojis, hashtags, and product link.",
      },
      pinterest: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "SEO optimized catchy title for Pinterest." },
          description: { type: Type.STRING, description: "Detailed SEO description for Pinterest (MUST NOT exceed 800 characters) with keywords, hashtags and call to action." }
        },
        required: ["title", "description"]
      },
      youtube: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "High CTR (Click-Through Rate) YouTube video title. Engaging and keyword-rich." },
          description: { type: Type.STRING, description: "Comprehensive YouTube video description. Include a hook in the first 2 lines, keyword usage, a call to action, the product link, and 3-5 relevant hashtags at the bottom." }
        },
        required: ["title", "description"]
      },
      tiktok: {
        type: Type.STRING,
        description: "Optimized TikTok caption. Short, snappy, and engaging with a strong hook. Includes 3-7 high-converting, trending hashtags. IMPORTANT: Do NOT include the product URL; use a 'Link in Bio' call to action instead."
      }
    },
    required: ["facebook", "instagram", "twitter", "linkedin", "vk", "pinterest", "youtube", "tiktok"]
  };
};

const generateTextPosts = async (ai: GoogleGenAI, input: UserInput, language: 'ar' | 'en'): Promise<GeneratedSocialContent> => {
    const systemInstruction = `
    You are an expert Social Media Manager and SEO Specialist.
    Your task is to create highly optimized and visually appealing social media posts for Facebook, Instagram, Pinterest, X (Twitter), LinkedIn, VK, YouTube, and TikTok.
    
    Guidelines:
    1. **Tone**: Professional, engaging, and persuasive.
    2. **Language**: The output MUST be in the same language as the user's description. If mixed, prioritize ${language === 'ar' ? 'Arabic' : 'English'}.
    3. **Emoji Strategy (CRITICAL)**:
       - **Decorate and beautify ALL posts** with relevant, professional, and well-placed emojis.
       - Emojis should enhance readability and emotional engagement, not clutter the text.
       - Tailor emoji use to the platform's tone (e.g., more playful on Instagram/TikTok, more professional on LinkedIn).
       - Use emojis to break up text and draw attention to key points like CTAs.
    4. **Structure & Links (CRITICAL)**: 
       - Use appropriate line breaks for readability. 
       - Use the provided Keyword naturally.
       - Include the Product URL ONLY where clickable (Facebook, X, LinkedIn, VK, Pinterest, YouTube).
       - **For Instagram and TikTok, you MUST NOT include the product URL**. Instead, you MUST use a clear call-to-action like 'Link in Bio' or 'الرابط في البايو'.
    5. **Platform Specifics**:
       - **Facebook**: Conversational, moderate length, link preview focus.
       - **Instagram**: Visual storytelling, a clear "Link in Bio" CTA (DO NOT include the URL in the caption), and a block of ~15-20 relevant hashtags at the bottom.
       - **X (Twitter)**: Concise, trending hashtags, direct link. The post MUST NOT exceed 300 characters.
       - **LinkedIn**: Professional, industry-focused, clear value proposition, use bullet points if applicable.
       - **VK**: Informal yet informative, widely used in CIS, similar to Facebook structure but can be more community-focused.
       - **Pinterest**: SEO-heavy Title and Description. The description MUST be under 800 characters.
       - **YouTube**: High-impact Title (under 60 chars preferred for mobile, but up to 100). Detailed description optimized for SEO, first 2 sentences are crucial. Include the link in the first paragraph.
       - **TikTok**: Short, snappy, and entertaining caption. Must include a strong hook. Use 3-7 highly relevant, trending hashtags. **CRITICAL: DO NOT include the URL**, use 'Link in Bio' instead.
    6. **Hashtags Strategy (CRITICAL)**: 
       - Research and select the **strongest, highest-converting hashtags** specifically for **US and European markets**. 
       - Consider the **current date and season** to include trending/seasonal tags.
       - Mix broad niche tags with specific long-tail tags for maximum reach.
  `;

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const prompt = `
    Product Description: ${input.description}
    Product URL: ${input.productUrl}
    Focus Keyword: ${input.keyword}
    Current Date for Trends: ${currentDate}

    Generate posts for all platforms (Facebook, Instagram, Twitter, LinkedIn, VK, Pinterest, YouTube, TikTok). Ensure hashtags are optimized for US/EU markets at this specific time.
  `;

  const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: getTextSchema(),
        temperature: 0.7,
      },
    });

  const text = response.text;
  if (!text) throw new Error("Empty text response from AI");
  return JSON.parse(text) as GeneratedSocialContent;
};

export const generateContent = async (input: UserInput, language: 'ar' | 'en'): Promise<FinalResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  if (!input.image) {
    throw new Error("Image is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const textPromise = generateTextPosts(ai, input, language);
    
    const imagePromises = (Object.keys(PLATFORM_DIMENSIONS) as Platform[]).map(platform => {
      const { width, height } = PLATFORM_DIMENSIONS[platform];
      return resizeImage(input.image!, width, height).then(imageData => ({ platform, imageData }));
    });
    
    const [posts, resizedImagesArray] = await Promise.all([
        textPromise,
        Promise.all(imagePromises)
    ]);
    
    const images = resizedImagesArray.reduce((acc, { platform, imageData }) => {
        acc[platform] = imageData;
        return acc;
    }, {} as Record<Platform, string>);

    return { posts, images };
  } catch (error) {
    console.error("Content Generation Error:", error);
    throw error;
  }
};