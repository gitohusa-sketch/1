
import { GoogleGenAI, Chat } from "@google/genai";
import { IMAGE_MODEL_NAME, CHAT_MODEL_NAME } from '../constants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: CHAT_MODEL_NAME,
    config: {
        systemInstruction: "You are a helpful and creative assistant. Provide clear, concise, and informative answers.",
    }
  });
};

interface GenerateImagesParams {
  prompt: string;
  numberOfImages: number;
  aspectRatio: string;
}

export const generateImagesService = async ({ prompt, numberOfImages, aspectRatio }: GenerateImagesParams): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
      model: IMAGE_MODEL_NAME,
      prompt,
      config: {
        numberOfImages,
        outputMimeType: 'image/jpeg',
        aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    }
    return [];
  } catch (error) {
    console.error("Error generating images:", error);
    throw new Error("Failed to generate images. Please check the console for details.");
  }
};
