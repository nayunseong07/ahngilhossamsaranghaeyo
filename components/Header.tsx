import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-[9999] isolate shadow-md"
      style={{
        backgroundColor: 'rgb(15 23 42)', // 남색 (Tailwind slate-900)
      }}
    >
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* 🔙 뒤로가기 + 로고 */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            aria-label="홈으로 돌아가기"
            className="p-2 rounded-full hover:bg-white/10 transition text-slate-200"
          >
            ←
          </button>

          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => onCategoryChange('All')}
          >
            <span className="text-xl font-bold text-white hover:text-indigo-400 transition-colors">
              My Websites
            </span>
          </Link>
        </div>

        {/* 카테고리 */}
        <div className="hidden sm:flex items-center space-x-2 bg-white/10 p-1 rounded-full">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${
                activeCategory === category
                  ? 'bg-slate-800 text-indigo-300 shadow-sm'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              {category === 'All' ? '전체' : category}
            </button>
          ))}
        </div>

        {/* 오른쪽 영역 */}
        <div className="relative flex items-center space-x-4">
          <img
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="h-9 w-9 rounded-full object-cover cursor-pointer"
            src="https://picsum.photos/seed/avatar/100/100"
            alt="User Avatar"
          />

          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-4">
              <p className="text-sm font-semibold text-white">
                다니엘
              </p>
              <p className="text-xs text-slate-400 mt-1">
                nayuns07@gmail.com
              </p>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
