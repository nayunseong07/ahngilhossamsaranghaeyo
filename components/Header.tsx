import React from 'react';

interface HeaderProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}


const Header: React.FC<HeaderProps> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span className="text-xl font-bold text-slate-900 dark:text-white">My Websites</span>
        </div>
        
        <div className="hidden sm:flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-full">
          {categories.map(category => (
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

        <div className="flex items-center space-x-4">
           <button aria-label="Notifications" className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <img className="h-9 w-9 rounded-full object-cover" src="https://picsum.photos/seed/avatar/100/100" alt="User Avatar" />
        </div>
      </nav>
    </header>
  );
};

export default Header;