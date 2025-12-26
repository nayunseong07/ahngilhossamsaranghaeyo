
import React, { useState, useCallback } from 'react';

interface EmojiItem {
  id: string;
  char: string;
  x: number;
  y: number;
}

const EMOJIS = ['😀', '🥳', '🚀', '🌈', '🍕', '🐱', '💡', '🔥', '✨', '🎮', '🍩', '🥑'];

interface BasicEmoji extends EmojiItem {
  size: number;
  rotation: number;
}

const App: React.FC = () => {
  const [emojis, setEmojis] = useState<BasicEmoji[]>([]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // 1. 랜덤 속성 생성 (크기, 회전)
    const randomChar = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const newEmoji: BasicEmoji = {
      id: Math.random().toString(36).substring(2, 9),
      char: randomChar,
      x: e.clientX,
      y: e.clientY,
      size: Math.floor(Math.random() * 40) + 30, // 30px ~ 70px
      rotation: Math.floor(Math.random() * 60) - 30, // -30도 ~ 30도
    };

    // 2. 상태 업데이트 (애니메이션/소리 없이 즉시 반영)
    setEmojis((prev) => [...prev, newEmoji]);
  }, []);

  const clearEmojis = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEmojis([]);
  };

  return (
    <div 
      className="relative w-screen h-screen bg-white overflow-hidden cursor-crosshair select-none border-[12px] border-black"
      onClick={handleClick}
    >
      {/* 실시간 카운터 UI */}
      <div className="absolute top-6 left-6 text-black font-mono text-2xl font-black pointer-events-none">
        COUNT: {emojis.length}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-200 text-xs font-bold tracking-tighter pointer-events-none">
        BASIC MODE / CLICK ANYWHERE
      </div>

      {/* 이모지 렌더링 (애니메이션 transition 제거) */}
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute"
          style={{ 
            left: emoji.x, 
            top: emoji.y,
            fontSize: `${emoji.size}px`,
            transform: `translate(-50%, -50%) rotate(${emoji.rotation}deg)`,
            pointerEvents: 'none' // 클릭 방해 금지
          }}
        >
          {emoji.char}
        </div>
      ))}

      {/* 리셋 버튼 (심플한 베이직 스타일) */}
      {emojis.length > 0 && (
        <button
          onClick={clearEmojis}
          className="fixed bottom-8 right-8 px-8 py-4 bg-black text-white text-sm font-bold border-2 border-black active:bg-white active:text-black"
        >
          RESET ALL
        </button>
      )}
    </div>
  );
};

export default App;
