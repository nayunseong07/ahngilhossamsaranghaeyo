
import React, { useState, useMemo } from 'react';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const arr = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let i = 1; i <= totalDays; i++) arr.push(new Date(year, month, i));
    return arr;
  }, [currentDate]);

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans text-black">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 px-2">
          <h1 className="text-xl font-bold tracking-tight">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </h1>
          <div className="flex gap-4">
            <button onClick={() => changeMonth(-1)} className="hover:opacity-50 transition-opacity">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => changeMonth(1)} className="hover:opacity-50 transition-opacity">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 mb-4 border-b border-gray-100 pb-2">
          {['일', '월', '화', '수', '목', '금', '토'].map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-gray-400">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="aspect-square" />;
            
            const dateStr = date.toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => handleDateClick(date)}
                className={`
                  relative aspect-square flex items-center justify-center text-sm transition-all
                  ${isSelected ? 'border-2 border-black font-bold' : 'hover:bg-gray-50'}
                  ${isToday && !isSelected ? 'text-blue-600 font-bold' : ''}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Selected Info Footer */}
        <div className="mt-12 text-center h-6">
          {selectedDate && (
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest animate-in fade-in duration-500">
              Selected: {selectedDate.replace(/-/g, '.')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
