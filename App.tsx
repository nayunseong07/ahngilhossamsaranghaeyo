import React, { useState } from 'react';
import { Website } from './types';
import Header from './components/Header';
import WebsiteCard from './components/WebsiteCard';
import AddWebsiteButton from './components/AddWebsiteButton';
import Footer from './components/Footer';
import { initialWebsites } from './constants';

const App: React.FC = () => {
  const [websites, setWebsites] = useState<Website[]>(initialWebsites);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories = ['All', '학업', '취미', '활동'];

  const handleAddWebsite = () => {
    const newId = `website-${Date.now()}`;
    const newCategory = (activeCategory === 'All' ? '활동' : activeCategory) as '학업' | '취미' | '활동';

    const newWebsite: Website = {
      id: newId,
      name: `New Project ${websites.length + 1}`,
      description: 'A brief description of your new amazing website.',
      thumbnailUrl: `https://picsum.photos/seed/${newId}/500/300`,
      lastUpdated: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      category: newCategory,
    };
    setWebsites(prev => [...prev, newWebsite]);
  };

  const handleDeleteWebsite = (id: string) => {
    setWebsites(prev => prev.filter(website => website.id !== id));
  };

  const filteredWebsites = websites.filter(
    website => activeCategory === 'All' || website.category === activeCategory
  );

  return (
    <div className="flex flex-col min-h-screen text-slate-800 dark:text-slate-200">
      <Header 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">My Websites</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Here are the projects you've been working on. Keep up the great work!</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredWebsites.map(website => (
            <WebsiteCard key={website.id} website={website} onDelete={handleDeleteWebsite} />
          ))}
          <AddWebsiteButton onClick={handleAddWebsite} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;