
import React from 'react';
import { Website } from '../types';
import { Link } from 'react-router-dom';

interface WebsiteCardProps {
  website: Website;
  onDelete: (id: string) => void;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onDelete }) => {
  return (
    <Link to={website.path} className="block">
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
      </div>
    </Link>
  );
};

export default WebsiteCard;
