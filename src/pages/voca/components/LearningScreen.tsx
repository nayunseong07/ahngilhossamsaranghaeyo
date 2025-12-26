
import React, { useState, useEffect, useCallback } from 'react';
import { VocabularyWord } from '../types';
import { VocabularyCard } from './VocabularyCard';
import { LeftArrowIcon, RightArrowIcon } from './Icons';

interface LearningScreenProps {
  wordSet: VocabularyWord[];
  onBack: () => void;
  onStartTest: () => void;
}

const LearningScreen: React.FC<LearningScreenProps> = ({ wordSet, onBack, onStartTest }) => {
  const [currentList, setCurrentList] = useState<VocabularyWord[]>(wordSet);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordsToReview, setWordsToReview] = useState<VocabularyWord[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [animationClass, setAnimationClass] = useState('animate-slide-in');
  const [isProgressPulse, setIsProgressPulse] = useState(false);
  
  const currentWord = currentList[currentIndex];

  const handleNext = useCallback((action: 'know' | 'learn') => {
    // Visual Feedback: Pulse the progress bar (Goal Gradient Effect)
    setIsProgressPulse(true);
    setTimeout(() => setIsProgressPulse(false), 300);

    if (action === 'learn' && !isReviewing) {
      if (!wordsToReview.some(w => w.id === currentWord.id)) {
        setWordsToReview(prev => [...prev, currentWord]);
      }
    }

    const directionClass = action === 'learn' ? 'animate-slide-out-left' : 'animate-slide-out-right';
    setAnimationClass(directionClass);

    setTimeout(() => {
      if (currentIndex < currentList.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
      setAnimationClass('animate-slide-in');
    }, 300); // Match animation duration

  }, [currentIndex, currentList.length, currentWord, isReviewing, wordsToReview]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFinished || !currentWord) return;
      if (event.key === 'ArrowLeft') {
        handleNext('learn');
      } else if (event.key === 'ArrowRight') {
        handleNext('know');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, isFinished, currentWord]);

  const handleRestart = () => {
    setCurrentList(wordSet);
    setCurrentIndex(0);
    setWordsToReview([]);
    setIsReviewing(false);
    setIsFinished(false);
    setAnimationClass('animate-slide-in');
  };

  const handleReview = () => {
    if (wordsToReview.length > 0) {
      setCurrentList(wordsToReview);
      setCurrentIndex(0);
      setIsReviewing(true);
      setIsFinished(false);
      setAnimationClass('animate-slide-in');
    }
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-md p-6 bg-slate-800 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-cyan-300">{isReviewing ? "복습 완료!" : "학습 완료!"}</h2>
        <p className="text-slate-300 mb-6">다음 단계로 무엇을 하시겠어요?</p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleRestart}
            className="w-full bg-slate-600 text-slate-200 font-bold py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors"
          >
            다시 학습하기
          </button>
          <button
            onClick={handleReview}
            disabled={wordsToReview.length === 0}
            className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            모르는 단어만 학습하기 ({wordsToReview.length}개)
          </button>
          <button
            onClick={onStartTest}
            className="w-full bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            시험 보기
          </button>
          <button
            onClick={onBack}
            className="w-full border-2 border-slate-600 text-slate-300 font-bold py-2.5 px-4 rounded-lg hover:bg-slate-700 transition-colors"
          >
            세트 선택하기
          </button>
        </div>
      </div>
    );
  }

  if (!currentWord) return null;
  
  const progress = ((currentIndex + 1) / currentList.length) * 100;

  return (
    <div className="w-full max-w-md p-4">
      <div className="flex justify-between items-center mb-2">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-200">← 메뉴로</button>
        <div className="text-sm text-cyan-400 font-semibold">{isReviewing ? "복습 중" : "학습 중"}</div>
        <div className="text-sm text-slate-400">{currentIndex + 1} / {currentList.length}</div>
      </div>
      
      <div className="w-full bg-slate-700 rounded-full h-2.5 mb-4 overflow-hidden">
        <div 
          className={`bg-cyan-400 h-2.5 rounded-full transition-all duration-300 ease-in-out ${isProgressPulse ? 'shadow-[0_0_12px_rgba(34,211,238,0.8)] brightness-125' : ''}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <VocabularyCard word={currentWord} isReviewing={isReviewing} animationClass={animationClass} />

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center space-x-3">
          <button onClick={() => handleNext('learn')} className="p-4 rounded-full bg-slate-700 hover:bg-yellow-600 transition-colors">
            <LeftArrowIcon />
          </button>
          <span className="font-semibold text-yellow-400">학습할래요</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-green-400">알아요</span>
          <button onClick={() => handleNext('know')} className="p-4 rounded-full bg-slate-700 hover:bg-green-600 transition-colors">
            <RightArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningScreen;
