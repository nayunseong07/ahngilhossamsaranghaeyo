
import React, { useState } from 'react';

const App: React.FC = () => {
  // 사용자가 요청한 방식대로 지정한 음식 이모지 리스트
  const FOOD_LIST = ['🍕', '🍔', '🍣', '🍜', '🍗', '🍛', '🍱', '🥘', '🍲', '🍝', '🌮', '🥪'];
  
  const [currentEmoji, setCurrentEmoji] = useState<string>('🍴');

  const handlePick = () => {
    // 배열 안에서 랜덤으로 하나 추출
    const randomIndex = Math.floor(Math.random() * FOOD_LIST.length);
    setCurrentEmoji(FOOD_LIST[randomIndex]);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      margin: 0,
      padding: 0
    }}>
      {/* 폰 레스토프 효과: 정보를 매우 크게 노출 */}
      <div style={{ fontSize: '15rem', marginBottom: '4rem', userSelect: 'none' }}>
        {currentEmoji}
      </div>

      {/* 힉의 법칙: 조작을 단순화한 단일 버튼 */}
      <button
        onClick={handlePick}
        style={{
          padding: '20px 40px',
          fontSize: '24px',
          fontWeight: 'bold',
          backgroundColor: '#000000',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        저녁 추천
      </button>
    </div>
  );
};

export default App;
