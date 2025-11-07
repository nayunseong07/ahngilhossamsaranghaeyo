
import React from 'react';
import { Website } from '../types';

interface WebsiteCardProps {
  website: Website;
  onDelete: (id: string) => void;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onDelete }) => {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col overflow-hidden">
      <div className="relative">
        <img className="w-full h-40 object-cover" src={website.thumbnailUrl} alt={website.name} />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{website.name}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm flex-grow">{website.description}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">Last Updated: {website.lastUpdated}</p>
      </div>
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-2">
         <button className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1 px-3 rounded-md">
            View
        </button>
        <button 
          onClick={() => onDelete(website.id)}
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors py-1 px-3 rounded-md">
            Delete
        </button>
      </div>
    </div>
  );
};

export default WebsiteCard;
