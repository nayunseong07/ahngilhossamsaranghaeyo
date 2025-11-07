
import React from 'react';

interface AddWebsiteButtonProps {
  onClick: () => void;
}

const AddWebsiteButton: React.FC<AddWebsiteButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300 ease-in-out flex flex-col items-center justify-center min-h-[280px] sm:min-h-full aspect-auto"
    >
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
        </svg>
        <span className="mt-2 block text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Create New Website</span>
      </div>
    </button>
  );
};

export default AddWebsiteButton;
