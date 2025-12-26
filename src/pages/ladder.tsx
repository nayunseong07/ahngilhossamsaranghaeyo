
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const LadderGame = () => {
  const [names, setNames] = useState(['참가자1', '참가자2', '참가자3']);
  const [goals, setGoals] = useState(['당첨1', '당첨2', '당첨3']);
  const [results, setResults] = useState<string[] | null>(null);

  // 3명의 사다리 로직 (AI 없이 순수 자바스크립트로 구현)
  const calculateResult = () => {
    // 결과 배열을 무작위로 섞음 (Fisher-Yates Shuffle)
    const shuffledGoals = [...goals];
    for (let i = shuffledGoals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledGoals[i], shuffledGoals[j]] = [shuffledGoals[j], shuffledGoals[i]];
    }
    setResults(shuffledGoals);
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const resetGame = () => {
    setResults(null);
  };

  return (
    <div style={{
      fontFamily: 'sans-serif',
      padding: '20px',
      maxWidth: '400px',
      margin: '0 auto',
      color: '#333',
      lineHeight: '1.6'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>3인 사다리타기</h2>
      
      {/* 입력 섹션: 덩어리화(Chunking) 원리 적용 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        {names.map((name, i) => (
          <input
            key={`name-${i}`}
            value={name}
            onChange={(e) => handleNameChange(i, e.target.value)}
            style={{ width: '30%', padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}
            aria-label={`참가자 ${i + 1} 이름`}
          />
        ))}
      </div>

      {/* 시각적 사다리 구조 (정적) */}
      <div style={{ 
        borderLeft: '2px solid #333', 
        borderRight: '2px solid #333', 
        height: '150px', 
        margin: '0 auto',
        width: '80%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ borderLeft: '2px solid #333', height: '100%', position: 'absolute', left: '50%' }}></div>
        <div style={{ position: 'absolute', top: '30px', width: '50%', borderTop: '2px solid #333', left: '0' }}></div>
        <div style={{ position: 'absolute', top: '70px', width: '50%', borderTop: '2px solid #333', right: '0' }}></div>
        <div style={{ position: 'absolute', top: '110px', width: '50%', borderTop: '2px solid #333', left: '0' }}></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        {goals.map((goal, i) => (
          <input
            key={`goal-${i}`}
            value={goal}
            onChange={(e) => handleGoalChange(i, e.target.value)}
            style={{ width: '30%', padding: '8px', textAlign: 'center', border: '1px solid #ccc' }}
            aria-label={`결과 ${i + 1} 항목`}
          />
        ))}
      </div>

      {/* 실행 버튼: 명확한 행동 유도(Affordance) */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        {!results ? (
          <button 
            onClick={calculateResult}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            결과 확인하기
          </button>
        ) : (
          <div>
            <div style={{ 
              backgroundColor: '#f4f4f4', 
              padding: '15px', 
              borderRadius: '8px',
              textAlign: 'left',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginTop: 0 }}>최종 매칭 결과</h3>
              <ul style={{ paddingLeft: '20px' }}>
                {names.map((name, i) => (
                  <li key={`res-${i}`}>
                    <strong>{name}</strong> ➔ {results[i]}
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={resetGame}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #666',
                cursor: 'pointer'
              }}
            >
              다시 하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LadderGame;