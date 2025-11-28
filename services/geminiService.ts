import { GoogleGenerativeAI } from "@google/generative-ai";
import { Language } from "../types";

// Initialize Gemini
const ai = new GoogleGenerativeAI(process.env.API_KEY as string);

const MODEL_FLASH = "gemini-2.5-flash";

/**
 * Convert File → Base64
 */
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyze Crop Image
 */
export const analyzeCropImage = async (
  base64Image: string,
  mimeType: string,
  lang: Language
) => {
  try {
    const promptText = `Analyze this crop/leaf image and return JSON only.

Fields:
- cropDetected
- condition (Healthy | Disease Detected | Nutrient Deficiency | Unknown)
- healthScore (0-100)
- diagnosis
- reasoning

${
  lang === "hi"
    ? 'IMPORTANT: "diagnosis" and "reasoning" must be in HINDI only.'
    : "Reply in English."
}`;

    const model = ai.getGenerativeModel({
      model: MODEL_FLASH,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const response = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
      { text: promptText },
    ]);

    return JSON.parse(response.response.text());
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

/**
 * Generate Treatment Plan
 */
export const getTreatmentPlan = async (
  diagnosis: string,
  crop: string,
  lang: Language
) => {
  try {
    const model = ai.getGenerativeModel({ model: MODEL_FLASH });

    const response = await model.generateContent(
      `My ${crop} crop is diagnosed with: ${diagnosis}.
Rules:
1. Max 50 words
2. Only bullet points
3. Must be actionable
${lang === "hi" ? "Reply ONLY in Hindi." : ""}
`
    );

    return response.response.text();
  } catch (error) {
    console.error("Treatment Error:", error);
    return lang === "hi"
      ? "उपचार योजना बनाने में समस्या।"
      : "Unable to generate treatment plan.";
  }
};

/**
 * Chat with AI Assistant
 */
export const chatWithAssistant = async (
  history: { role: "user" | "model"; text: string }[],
  message: string,
  lang: Language
) => {
  try {
    const chat = ai.getGenerativeModel({ model: MODEL_FLASH }).startChat({
      history: history.map((h) => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
      systemInstruction: `You are AgriBot, an expert agriculture assistant. ${
        lang === "hi" ? "Reply in Hindi only." : "Reply in English."
      }`,
    });

    const response = await chat.sendMessage(message);
    return response.response.text();
  } catch (error) {
    console.error("Chat Error:", error);
    return lang === "hi"
      ? "कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।"
      : "Connection error. Try again.";
  }
};
