
import React, { useState } from 'react';

const App: React.FC = () => {
  // 0: "단어 재시", 1: "통과하자!!"
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <div 
      className="flex items-center justify-center min-h-screen w-full bg-white cursor-pointer select-none"
      onClick={() => setClicked(true)}
    >
      <h1 className="text-5xl md:text-8xl font-bold text-gray-900">
        {!clicked ? "단어 재시" : "통과하자!!"}
      </h1>
    </div>
  );
};

export default App;
