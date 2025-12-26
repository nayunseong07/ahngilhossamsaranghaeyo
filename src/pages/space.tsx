
import React, { useState, useEffect, useCallback } from 'react';

const space: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault(); // 스페이스바의 기본 동작 (스크롤 등) 방지
      setCount(prevCount => prevCount + 1);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 200); // 애니메이션 지속 시간 후 상태 초기화
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <main className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4 select-none font-sans">
      <div className="text-center w-full max-w-md">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400">
            스페이스바 카운터
          </h1>
          <p className="text-slate-400 mt-3 text-lg">
            스페이스바를 눌러 숫자를 올려보세요.
          </p>
        </header>

        <div className="bg-slate-800 rounded-full w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/10 border-4 border-slate-700">
          <span 
            className={`text-7xl md:text-9xl font-mono font-bold text-white transition-transform duration-200 ease-out ${animate ? 'scale-125' : 'scale-100'}`}
          >
            {count}
          </span>
        </div>

        <footer className="mt-16 text-slate-500">
          <p>화면 아무 곳이나 클릭한 후 스페이스바를 누르세요.</p>
        </footer>
      </div>
    </main>
  );
};

export default space;
