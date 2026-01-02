import { GoogleGenAI } from "@google/genai";

// 변경: 브라우저에서 Vite가 주입하는 import.meta.env 우선 사용, 그 외 폴백 지원
const API_KEY = (import.meta as any)?.env?.VITE_GOOGLE_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY || "";

export const getSpaceResponse = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "당신은 중학교 2학년 과학 멘토입니다. 답변은 3줄 내외로 짧고 강렬하게 하며, 마지막에 핵심 키워드 2개를 [키워드1, 키워드2] 형식으로 반드시 포함하세요.",
      temperature: 0.8,
    },
  });
  return response.text;
};

export const generateSpaceImage = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A high-quality, realistic space photography of ${prompt}, cinematic lighting, 4k resolution` }]
    },
    config: {
      imageConfig: { aspectRatio: "16:9" }
    }
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
