
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { VocabularyWord } from '../types';
import { SpinnerIcon } from './Icons';

// Declare confetti on the window object for TypeScript
declare global {
  interface Window {
    confetti: any;
  }
}

interface TestingScreenProps {
  wordSet: VocabularyWord[];
  onBack: () => void;
}

interface Result {
  word: VocabularyWord;
  userAnswer: string;
  isCorrect: boolean;
}

const TestingScreen: React.FC<TestingScreenProps> = ({ wordSet, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isGrading, setIsGrading] = useState(false);

  const currentWord = wordSet[currentIndex];

  useEffect(() => {
    if (isFinished) {
      const score = results.filter(r => r.isCorrect).length;
      if (score === wordSet.length && typeof window.confetti === 'function') {
        window.confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          zIndex: 1000
        });
      }
    }
  }, [isFinished, results, wordSet.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || isGrading) return;

    setIsGrading(true);
    let isCorrect = false;

    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is missing.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Is the student's answer an acceptable meaning for the English word?
        - English Word: "${currentWord.word}"
        - Correct Korean Meaning: "${currentWord.koreanMeaning}"
        - Student's Answer: "${userAnswer.trim()}"
        `,
        config: {
          systemInstruction: "You are a helpful AI assistant grading a Korean student's English vocabulary test. Be generous but accurate. Consider common synonyms. Respond with ONLY a valid JSON object with a single boolean key 'isCorrect'.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isCorrect: { type: Type.BOOLEAN },
            },
            required: ['isCorrect'],
          },
        },
      });

      const result = JSON.parse(response.text.trim());
      isCorrect = result.isCorrect;

    } catch (err) {
      console.error("Error during AI grading:", err);
      // Fallback to simple string comparison on error
      isCorrect = userAnswer.trim() === currentWord.koreanMeaning.trim();
    } finally {
      setIsGrading(false);
    }


    const newResult: Result = {
      word: currentWord,
      userAnswer: userAnswer.trim(),
      isCorrect,
    };
    setResults(prev => [...prev, newResult]);

    if (currentIndex < wordSet.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
    } else {
      setIsFinished(true);
    }
  };
  
  if (isFinished) {
    const score = results.filter(r => r.isCorrect).length;

    return (
      <div className="w-full max-w-md p-6 bg-slate-800 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-2 text-cyan-300">시험 결과</h2>
        <p className="text-4xl font-bold mb-4">{score} / {wordSet.length}</p>
        
        {score === wordSet.length && (
          <p className="text-yellow-300 font-semibold mb-4">🎉 완벽해요! 축하합니다! 🎉</p>
        )}

        <div className="text-left my-6">
          <h3 className="font-bold text-lg mb-2 text-slate-300">결과 상세보기</h3>
          <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-2">
            {results.map(({word, userAnswer, isCorrect}) => (
              <li key={word.id} className="bg-slate-700 p-2 rounded">
                <p className="font-semibold">{word.word}</p>
                <p>정답: <span className="text-green-400">{word.koreanMeaning}</span></p>
                <p>내 답안: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{userAnswer || '(입력 안 함)'}</span></p>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onBack}
          className="w-full mt-4 bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / wordSet.length) * 100;

  return (
    <div className="w-full max-w-md p-4">
       <div className="flex justify-between items-center mb-2">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-200">← 메뉴로</button>
        <div className="text-sm text-slate-400">{currentIndex + 1} / {wordSet.length}</div>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5 mb-4">
        <div 
          className="bg-cyan-400 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-center p-8 bg-slate-800 rounded-lg shadow-md">
        <p className="text-4xl md:text-5xl font-bold mb-4">{currentWord.word}</p>
        <p className="text-slate-400 italic">{currentWord.partOfSpeech}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="뜻을 입력하세요..."
          className="w-full p-4 bg-slate-700 border-2 border-slate-600 rounded-lg text-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-slate-800"
          autoFocus
          disabled={isGrading}
        />
        <button
          type="submit"
          className="w-full mt-4 bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors flex justify-center items-center disabled:bg-slate-600"
          disabled={!userAnswer.trim() || isGrading}
        >
          {isGrading ? <SpinnerIcon /> : '제출'}
        </button>
      </form>
    </div>
  );
};

export default TestingScreen;
