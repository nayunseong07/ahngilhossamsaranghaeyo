
import React from 'react';
import { VocabularyWord } from '../types';
import { TestIcon } from './Icons';

interface SetSelectionScreenProps {
  words: VocabularyWord[];
  onSelectSet: (index: number) => void;
  onStartTest: (index: number) => void;
}

const SetSelectionScreen: React.FC<SetSelectionScreenProps> = ({ words, onSelectSet, onStartTest }) => {
  const setsCount = Math.ceil(words.length / 10);
  const sets = Array.from({ length: setsCount }, (_, i) => i);

  return (
    <div className="w-full max-w-md p-4 bg-slate-800 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-cyan-300">ACT Vocabulary Sets</h1>
      <div className="space-y-3">
        {sets.map((setIndex) => (
          <div key={setIndex} className="flex items-center justify-between bg-slate-700 rounded-lg p-3 transition-all duration-200 hover:bg-slate-600">
            <button
              onClick={() => onSelectSet(setIndex)}
              className="flex-grow text-left text-lg font-semibold"
            >
              Set {setIndex + 1}
              <span className="text-sm text-slate-400 ml-2">({`Words ${setIndex * 10 + 1} - ${(setIndex + 1) * 10}`})</span>
            </button>
            <button
              onClick={() => onStartTest(setIndex)}
              className="p-2 rounded-md hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-colors"
              aria-label={`Start test for Set ${setIndex + 1}`}
            >
              <TestIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetSelectionScreen;
