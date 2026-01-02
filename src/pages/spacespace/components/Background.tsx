import React, { useMemo } from 'react';

const Background: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3}px`,
      duration: `${2 + Math.random() * 5}s`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            '--duration': star.duration,
          } as React.CSSProperties}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-black" />
    </div>
  );
};

export default Background;
