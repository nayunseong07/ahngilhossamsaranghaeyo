
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export interface TravelRecommendation {
  country: string;
  city: string;
  attractions: string[];
  description: string;
  continent: string;
}

const continents = ["유럽", "남아메리카", "북아메리카", "아프리카", "오세아니아", "중동", "동남아시아"];

export const fetchRandomTravel = async (theme: string = "무작위"): Promise<TravelRecommendation> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const randomContinent = continents[Math.floor(Math.random() * continents.length)];
  
  const prompt = `
    명령: 전 세계 중 ${randomContinent} 지역의 한 국가와 도시를 추천해줘.
    조건:
    1. ${theme} 컨셉의 여행지여야 함.
    2. 절대 일본(도쿄, 오사카)은 추천하지 마.
    3. 중학교 2학년 학생이 흥미로워할 만한 이색적이고 새로운 곳 위주로 선정해줘.
    4. 친근한 말투로 설명해줘.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          country: { type: Type.STRING },
          city: { type: Type.STRING },
          continent: { type: Type.STRING },
          attractions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          description: { type: Type.STRING }
        },
        required: ["country", "city", "attractions", "description", "continent"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};
