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
    <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* 🔙 뒤로가기 + 로고 */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            aria-label="홈으로 돌아가기"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300"
          >
            ←
          </button>

          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => onCategoryChange('All')}
          >
            <span className="text-xl font-bold text-slate-900 dark:text-white hover:text-indigo-500 transition-colors">
              My Websites
            </span>
          </Link>
        </div>

        {/* 카테고리 */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-full">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${
                activeCategory === category
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              {category === 'All' ? '전체' : category}
            </button>
          ))}
        </div>

        {/* 오른쪽 영역 */}
        <div className="relative flex items-center space-x-4">
          <button
            aria-label="Notifications"
            className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            🔔
          </button>

          {/* 👤 프로필 */}
          <img
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="h-9 w-9 rounded-full object-cover cursor-pointer"
            src="https://picsum.photos/seed/avatar/100/100"
            alt="User Avatar"
          />

          {/* 프로필 박스 */}
          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                다니엘
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
