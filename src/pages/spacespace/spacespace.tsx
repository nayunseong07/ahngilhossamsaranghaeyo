import React, { useState, useRef, useEffect } from 'react';
import { getSpaceResponse, generateSpaceImage } from './services/geminiService';
import { audioService } from './services/audioService';
import Background from './components/Background';

interface Message {
  role: 'user' | 'bot';
  text: string;
  image?: string;
  keywords?: string[];
}

const QUICK_PROMPTS = ["블랙홀 관측", "토성의 고리", "안드로메다 은하", "태양의 흑점"];

const spacespace: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '반가워! 우주에 대해 무엇이든 물어봐. 함께 신비한 우주 여행을 떠나볼까?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customInput?: string) => {
    const targetInput = customInput || input;
    if (!targetInput.trim() || isLoading) return;
    
    audioService.playClick();
    const userMsg = targetInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const textResponse = await getSpaceResponse(userMsg);
      const imageUrl = await generateSpaceImage(userMsg);
      
      const keywordMatch = textResponse.match(/\[(.*?)\]/);
      const keywords = keywordMatch ? keywordMatch[1].split(',').map(k => k.trim()) : [];
      const cleanText = textResponse.replace(/\[.*?\]/, '').trim();

      audioService.playSpaceEcho();
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: cleanText, 
        image: imageUrl || undefined,
        keywords
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "우주 통신 장비에 오류가 생겼어. 다시 시도해줄래?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center p-4 md:p-8">
      <Background />
      
      <header className="z-10 text-center mb-6 mt-4">
        <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400 mb-2 tracking-tighter">
          COSMIC EXPLORER
        </h1>
        <p className="text-blue-200/50 text-xs font-bold tracking-[0.3em]">
          VISUAL KNOWLEDGE INTERFACE
        </p>
      </header>

      <main className="z-10 w-full max-w-4xl flex-1 flex flex-col md:flex-row gap-4 overflow-hidden mb-4">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col glass rounded-3xl overflow-hidden shadow-2xl border-white/10">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
              >
                <div className={`max-w-[90%] space-y-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white/10 text-blue-50 rounded-tl-none border border-white/10'
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                  </div>

                  {msg.image && (
                    <div className="rounded-xl overflow-hidden border border-white/20 shadow-2xl animate-in zoom-in-95 duration-700">
                      <img
                        src={msg.image}
                        alt="Space visualization"
                        className="w-full h-auto object-cover max-h-64"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-center gap-4">
                <div className="w-8 h-8 border-2 border-t-blue-400 border-white/10 rounded-full animate-spin"></div>
                <p className="text-blue-300 text-xs font-mono uppercase tracking-widest animate-pulse">
                  Scanning Universe...
                </p>
              </div>
            )}
          </div>

          {/* Quick Chips */}
          <div className="px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5 bg-black/20">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[10px] uppercase font-bold bg-indigo-500/10 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-200 px-3 py-1.5 rounded-lg transition-all active:scale-95 whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-black/40 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="무엇이든 물어봐, 탐험가님!"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-white/20 text-sm"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 transition-all px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest"
            >
              SEND
            </button>
          </div>
        </div>

        {/* Discovery Panel */}
        <div className="hidden md:flex w-64 flex-col glass rounded-3xl p-6 border-white/10">
          <h2 className="text-indigo-400 text-xs font-black mb-6 tracking-widest uppercase">
            Discovery Cards
          </h2>
          <div className="space-y-4">
            {messages.filter(m => m.keywords).slice(-1).map((msg, idx) =>
              msg.keywords?.map((kw, ki) => (
                <div
                  key={`${idx}-${ki}`}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl animate-in slide-in-from-right-4"
                >
                  <div className="w-8 h-1 bg-indigo-500 rounded-full mb-3"></div>
                  <p className="text-indigo-100 font-bold text-sm mb-1">{kw}</p>
                  <p className="text-white/40 text-[10px]">중2 과학 핵심 개념</p>
                </div>
              ))
            )}

            {messages.filter(m => m.keywords).length === 0 && (
              <p className="text-white/20 text-xs text-center py-20 italic">
                질문을 던져 지식을 발견하세요
              </p>
            )}
          </div>
        </div>
      </main>

      <footer className="z-10 text-[10px] text-white/20 font-mono">
        LOGS: VISUAL_RENDER_ACTIVE // AI_MENTOR_READY
      </footer>
    </div>
  );
};

export default spacespace;
