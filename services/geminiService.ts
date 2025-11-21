import { GoogleGenAI } from "@google/genai";
import { GenerationModel } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBackgroundStyle = async (
  prompt: string,
  userTitle: string,
  aspectRatioStr: string
): Promise<string> => {
  const ai = getClient();
  const ratioMap: Record<string, string> = {
    '1:1': '1:1',
    '4:5': '3:4', // Closest approx
    '5:4': '4:3',
    '9:16': '9:16',
    '16:9': '16:9'
  };

  const validRatio = ratioMap[aspectRatioStr] || '1:1';

  // Fallback if prompt is empty
  const styleDescription = prompt.trim() || "Modern, abstract, clean corporate aesthetic with subtle gradients";
  
  const finalPrompt = `
    Generate a background image.
    Style Description: ${styleDescription}.
    Context/Topic: ${userTitle}.
    Requirements:
    - NO TEXT in the image.
    - High contrast suitable for white text overlay OR very dark suitable for light text.
    - Abstract, geometric, or blurred photography style.
    - Professional, social media ready.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GenerationModel.NANO_BANANA,
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: validRatio as any,
          imageSize: "1K",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating background:", error);
    throw error;
  }
};

export const generateVeoVideo = async (prompt: string) => {
    const ai = getClient();
    
    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '9:16'
        }
    });
    
    return operation;
}

export const checkVideoOperation = async (operationName: string) => {
     const ai = getClient();
     return await ai.operations.getVideosOperation({ operation: operationName as any });
}