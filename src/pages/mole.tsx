
import React, { useState } from 'react';
import { MoleType } from '../../types';

interface MoleProps {
  id: number;
  isActive: boolean;
  type: MoleType;
  onWhack: (id: number) => void;
}

const Mole: React.FC<MoleProps> = ({ id, isActive, type, onWhack }) => {
  const [showEffect, setShowEffect] = useState(false);

  const handleClick = () => {
    if (isActive) {
      setShowEffect(true);
      setTimeout(() => setShowEffect(false), 300);
    }
    onWhack(id);
  };

  const isGolden = type === MoleType.GOLDEN;

  return (
    <div 
      className="relative w-full aspect-square bg-amber-900/40 rounded-full border-4 border-amber-950 overflow-hidden cursor-pointer active:scale-95 transition-transform"
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-black/30 rounded-full blur-sm" />
      
      {/* Hit Effect Wave */}
      {showEffect && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="w-4 h-4 bg-white/50 rounded-full animate-ping scale-[3]" />
        </div>
      )}

      <div 
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-4/5 transition-all duration-150 ease-out transform
          ${isActive ? 'translate-y-0 scale-100' : 'translate-y-full scale-50 opacity-0'}`}
      >
        <div className={`w-full h-full rounded-t-full shadow-lg flex flex-col items-center justify-center border-t-4 transition-colors
          ${isGolden 
            ? 'bg-yellow-400 border-yellow-200 animate-pulse' 
            : 'bg-orange-600 border-orange-400'}`}
        >
          <div className="flex gap-4 mt-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isGolden ? 'bg-indigo-900' : 'bg-black'}`} />
            <div className={`w-3 h-3 rounded-full animate-pulse ${isGolden ? 'bg-indigo-900' : 'bg-black'}`} />
          </div>
          <div className={`w-4 h-2 rounded-full mt-1 ${isGolden ? 'bg-red-400' : 'bg-pink-400'}`} />
          {isGolden && <div className="text-[8px] font-black text-yellow-800 mt-1 uppercase">Gold</div>}
        </div>
      </div>
    </div>
  );
};

export default Mole;
