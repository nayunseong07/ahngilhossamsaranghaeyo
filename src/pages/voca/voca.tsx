import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { View, VocabularyWord } from '../../../types';
import { ENGLISH_VOCABULARY_LIST } from './constants/vocabulary';
import SetSelectionScreen from './components/SetSelectionScreen';
import LearningScreen from './components/LearningScreen';
import TestingScreen from './components/TestingScreen';

const voca: React.FC = () => {
  const [view, setView] = useState<View>(View.SetSelection);
  const [vocabularyData, setVocabularyData] = useState<VocabularyWord[]>([]);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTranslations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is missing.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `For each English vocabulary word in the following JSON array, provide its most appropriate and natural Korean meaning in the 'koreanMeaning' field. The meaning should be concise and dictionary-like. Do not literally translate the English 'definition'. Maintain the exact original JSON structure. Data: ${JSON.stringify(ENGLISH_VOCABULARY_LIST)}`,
        config: {
          systemInstruction: "You are an expert lexicographer creating a high-quality vocabulary list for advanced Korean students studying for the ACT. Your translations must be natural, concise, and accurate, like those found in a proper dictionary. The output must be a valid JSON array of objects.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                word: { type: Type.STRING },
                partOfSpeech: { type: Type.STRING },
                definition: { type: Type.STRING },
                koreanMeaning: { type: Type.STRING },
              },
              required: ['id', 'word', 'partOfSpeech', 'definition', 'koreanMeaning'],
            },
          },
        },
      });

      const translatedData = JSON.parse(response.text.trim());
      setVocabularyData(translatedData);
    } catch (e) {
      console.error("Error fetching translations:", e);
      setError("Failed to load vocabulary data. Please check your API key and try again.");
      // Fallback to English definitions if translation fails
      setVocabularyData(ENGLISH_VOCABULARY_LIST.map(v => ({...v, koreanMeaning: v.definition})));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTranslations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectSet = (index: number) => {
    setSelectedSetIndex(index);
    setView(View.Learning);
  };

  const handleStartTest = (index: number) => {
    setSelectedSetIndex(index);
    setView(View.Testing);
  };

  const handleBackToMenu = () => {
    setSelectedSetIndex(null);
    setView(View.SetSelection);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
          <p className="mt-4 text-lg">단어 목록을 준비 중입니다...</p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">오류 발생</h2>
          <p className="text-slate-300">{error}</p>
        </div>
      );
    }

    switch (view) {
      case View.Learning:
        if (selectedSetIndex === null) return null;
        return (
          <LearningScreen
            wordSet={vocabularyData.slice(selectedSetIndex * 10, selectedSetIndex * 10 + 10)}
            onBack={handleBackToMenu}
            onStartTest={() => handleStartTest(selectedSetIndex)}
          />
        );
      case View.Testing:
        if (selectedSetIndex === null) return null;
        return (
          <TestingScreen
            wordSet={vocabularyData.slice(selectedSetIndex * 10, selectedSetIndex * 10 + 10)}
            onBack={handleBackToMenu}
          />
        );
      case View.SetSelection:
      default:
        return (
          <SetSelectionScreen
            words={vocabularyData}
            onSelectSet={handleSelectSet}
            onStartTest={handleStartTest}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default voca;