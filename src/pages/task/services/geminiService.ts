
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface AssignmentResult {
  summary: string;
  outline: {
    title: string;
    points: string[];
  }[];
}

export interface FeedbackResult {
  positives: string[];
  improvements: string[];
  revisedText: string;
}

export const analyzeAssignment = async (topic: string, length: string, format: string): Promise<AssignmentResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `과제 주제: ${topic}, 분량: ${length}, 제출 형식: ${format}. 
    중학교 2학년 학생의 눈높이에서 이해하기 쉽게 분석해줘.`,
    config: {
      systemInstruction: "당신은 중학생을 위한 친절한 학습 멘토입니다. 과제의 복잡한 요구사항을 간단히 요약하고, 논리적인 목차와 각 문단별 핵심 포인트를 제안하세요.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "과제 요구사항 요약" },
          outline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "문단 제목 또는 단계" },
                points: { type: Type.ARRAY, items: { type: Type.STRING }, description: "해당 문단에서 다룰 내용" }
              },
              required: ["title", "points"]
            }
          }
        },
        required: ["summary", "outline"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getDraftFeedback = async (topic: string, draft: string): Promise<FeedbackResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `주제: ${topic}\n초안 내용: ${draft}`,
    config: {
      systemInstruction: "당신은 글쓰기 튜터입니다. 중학교 2학년 수준에 맞춰 잘한 점, 개선할 점(구체적 방법), 그리고 더 나은 문장으로 다듬은 예시를 제공하세요. 친절하고 격려하는 말투를 사용하세요.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          positives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "칭찬할 점" },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "고칠 점" },
          revisedText: { type: Type.STRING, description: "개선된 예시 문단" }
        },
        required: ["positives", "improvements", "revisedText"]
      }
    }
  });

  return JSON.parse(response.text);
};
