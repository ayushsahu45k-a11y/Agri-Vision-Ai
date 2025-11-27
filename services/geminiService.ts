import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

// Initialize the client. API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Constants for model selection
const MODEL_FLASH = 'gemini-2.5-flash';

/**
 * Helper to convert file to base64 for Gemini
 */
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes crop image
 */
export const analyzeCropImage = async (base64Image: string, mimeType: string, lang: Language) => {
  try {
    const promptText = `Analyze this image of a plant/crop leaf. 
            Identify the crop type.
            Assess the health condition (Healthy, Disease Detected, or Nutrient Deficiency).
            Provide a health score from 0 to 100.
            Provide a diagnosis summary.
            Provide detailed reasoning for the diagnosis.
            
            ${lang === 'hi' ? 'IMPORTANT: Provide "diagnosis" and "reasoning" values in HINDI language.' : 'Provide details in English.'}

            Return the result in valid JSON format matching this schema:
            {
              "cropDetected": "string",
              "condition": "Healthy" | "Disease Detected" | "Nutrient Deficiency" | "Unknown",
              "healthScore": number,
              "diagnosis": "string",
              "reasoning": "string"
            }`;

    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: promptText
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropDetected: { type: Type.STRING },
            condition: { type: Type.STRING, enum: ["Healthy", "Disease Detected", "Nutrient Deficiency", "Unknown"] },
            healthScore: { type: Type.NUMBER },
            diagnosis: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

/**
 * Get detailed treatment plan ("AI-Analysis-with-US")
 */
export const getTreatmentPlan = async (diagnosis: string, crop: string, lang: Language) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: `My ${crop} has been diagnosed with: ${diagnosis}. 
      Provide a treatment plan.
      STRICT RULES:
      1. Maximum 50 words total.
      2. Use bullet points only.
      3. Be direct and actionable.
      ${lang === 'hi' ? 'IMPORTANT: Please reply strictly in HINDI.' : ''}`,
    });
    return response.text;
  } catch (error) {
    console.error("Treatment Plan Error:", error);
    return lang === 'hi' ? "उपचार योजना बनाने में असमर्थ।" : "Unable to generate treatment plan at this time.";
  }
};

/**
 * Chat with AI Assistant
 */
export const chatWithAssistant = async (history: {role: 'user' | 'model', text: string}[], message: string, lang: Language) => {
  try {
    const chat = ai.chats.create({
      model: MODEL_FLASH,
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      config: {
        systemInstruction: `You are an expert agricultural AI assistant named AgriBot. You help farmers with crop management, weather advice, and pest control. 
        ${lang === 'hi' ? 'Reply strictly in HINDI language.' : 'Reply in English.'}
        Be concise, helpful, and friendly.`
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return lang === 'hi' ? "कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।" : "Connection error. Please try again.";
  }
};