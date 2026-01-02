
import React, { useState, useCallback } from 'react';
import { fetchRandomTravel, TravelRecommendation } from './services/geminiService';
import { audioService } from './services/audioService';

const themes = [
  { id: 'random', label: '🎲 무작위', color: 'bg-indigo-500' },
  { id: 'city', label: '🏙️ 도시', color: 'bg-blue-500' },
  { id: 'nature', label: '🌲 자연', color: 'bg-emerald-500' },
  { id: 'activity', label: '🎢 액티비티', color: 'bg-orange-500' },
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<TravelRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState('random');

  const handleGetRecommendation = useCallback(async () => {
    audioService.playClick();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRandomTravel(activeTheme);
      setRecommendation(data);
      audioService.playSuccess();
    } catch (err) {
      setError("AI가 지도를 찾는 중 길을 잃었어요. 다시 시도해봐요!");
    } finally {
      setLoading(false);
    }
  }, [activeTheme]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8FAFC]">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">🌍 행운의 여행 뽑기</h1>
        <p className="text-slate-500 text-sm">중2의 감성으로 전 세계를 탐험해봐!</p>
      </header>

      <main className="w-full max-w-sm bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8">
        {/* 테마 선택 */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setActiveTheme(theme.id);
                audioService.playClick();
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTheme === theme.id
                  ? `${theme.color} text-white scale-105 shadow-md`
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm animate-pulse">비행기 연료 채우는 중...</p>
          </div>
        ) : recommendation ? (
          <div className="animate-in fade-in zoom-in duration-300">
            <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
              {recommendation.continent}
            </span>
            <h2 className="text-4xl font-black text-slate-800 mt-2 mb-1 tracking-tight">
              {recommendation.city}
            </h2>
            <p className="text-lg font-medium text-slate-400 mb-6">{recommendation.country}</p>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {recommendation.attractions.slice(0, 3).map((item, idx) => (
                  <span key={idx} className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-600 text-[11px] font-semibold">
                    # {item}
                  </span>
                ))}
              </div>
              <p className="text-slate-500 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl italic">
                "{recommendation.description}"
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✈️</div>
            <p className="text-slate-300 text-sm">어디로 갈지 정하지 못했다면?<br/>AI가 무작위로 찍어줄게!</p>
          </div>
        )}

        {error && <p className="text-red-400 text-xs text-center mt-4">{error}</p>}

        <button
          onClick={handleGetRecommendation}
          disabled={loading}
          className={`w-full mt-10 py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
            loading ? 'bg-slate-200' : 'bg-slate-900 hover:bg-black'
          }`}
        >
          {loading ? '검색 중...' : '여기로 가자! 🚀'}
        </button>
      </main>

      <footer className="mt-8 text-slate-400 text-[10px] tracking-widest uppercase">
        Cognitive Design for Middle Schoolers
      </footer>
    </div>
  );
};

export default App;
