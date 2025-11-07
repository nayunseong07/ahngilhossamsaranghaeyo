import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} nayuns07. All Rights Reserved.</p>
        <p className="mt-1">하오개로 351-4</p>
      </div>
    </footer>
  );
};

export default Footer;
