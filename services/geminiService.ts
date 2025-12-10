import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedSocialContent, UserInput } from "../types";

const getSchema = () => {
  return {
    type: Type.OBJECT,
    properties: {
      facebook: {
        type: Type.STRING,
        description: "Optimized Facebook post with emojis, engaging text, call to action, and the product link.",
      },
      instagram: {
        type: Type.STRING,
        description: "Optimized Instagram caption with strong visual hook, emojis, call to action (Link in Bio), and 15-20 relevant hashtags.",
      },
      twitter: {
        type: Type.STRING,
        description: "Optimized X (Twitter) post, short, punchy (MUST NOT exceed 300 characters), emojis, hashtags, and product link.",
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
          description: { type: Type.STRING, description: "Detailed SEO description for Pinterest with keywords, hashtags and call to action." }
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
      }
    },
    required: ["facebook", "instagram", "twitter", "linkedin", "vk", "pinterest", "youtube"]
  };
};

export const generateSocialPosts = async (input: UserInput, language: 'ar' | 'en'): Promise<GeneratedSocialContent> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are an expert Social Media Manager and SEO Specialist.
    Your task is to create highly optimized and visually appealing social media posts for Facebook, Instagram, Pinterest, X (Twitter), LinkedIn, VK, and YouTube.
    
    Guidelines:
    1. **Tone**: Professional, engaging, and persuasive.
    2. **Language**: The output MUST be in the same language as the user's description. If mixed, prioritize ${language === 'ar' ? 'Arabic' : 'English'}.
    3. **Emoji Strategy (CRITICAL)**:
       - **Decorate and beautify ALL posts** with relevant, professional, and well-placed emojis.
       - Emojis should enhance readability and emotional engagement, not clutter the text.
       - Tailor emoji use to the platform's tone (e.g., more playful on Instagram, more professional on LinkedIn).
       - Use emojis to break up text and draw attention to key points like CTAs.
    4. **Structure**: 
       - Use appropriate line breaks for readability. 
       - Use the provided Keyword naturally.
       - Include the Product URL where clickable (Facebook, X, LinkedIn, VK, Pinterest, YouTube). For Instagram, mention "Link in Bio" or put the link at the end for copy-pasting.
    5. **Platform Specifics**:
       - **Facebook**: Conversational, moderate length, link preview focus.
       - **Instagram**: Visual storytelling, "Link in Bio" CTA, block of ~15-20 relevant hashtags at the bottom.
       - **X (Twitter)**: Concise, trending hashtags, direct link. The post MUST NOT exceed 300 characters.
       - **LinkedIn**: Professional, industry-focused, clear value proposition, use bullet points if applicable.
       - **VK**: Informal yet informative, widely used in CIS, similar to Facebook structure but can be more community-focused.
       - **Pinterest**: SEO-heavy Title and Description.
       - **YouTube**: High-impact Title (under 60 chars preferred for mobile, but up to 100). Detailed description optimized for SEO, first 2 sentences are crucial. Include the link in the first paragraph.
    6. **Hashtags Strategy (CRITICAL)**: 
       - Research and select the **strongest, highest-converting hashtags** specifically for **US and European markets**. 
       - Consider the **current date and season** to include trending/seasonal tags.
       - Mix broad niche tags with specific long-tail tags for maximum reach.
  `;

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const prompt = `
    Product Description: ${input.description}
    Product URL: ${input.productUrl}
    Focus Keyword: ${input.keyword}
    Current Date for Trends: ${currentDate}

    Generate posts for all platforms (Facebook, Instagram, Twitter, LinkedIn, VK, Pinterest, YouTube). Ensure hashtags are optimized for US/EU markets at this specific time.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: getSchema(),
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(text) as GeneratedSocialContent;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};