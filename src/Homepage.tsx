import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Website } from '../types';
import { initialWebsites } from '../constants'; // 데이터가 들어있는 파일
import WebsiteCard from '../components/WebsiteCard';

// Layout에서 넘겨주는 데이터 타입 정의
interface LayoutContext {
  activeCategory: string;
}

const Homepage: React.FC = () => {
  // 1. Layout.tsx의 <Outlet context={{ activeCategory }} /> 에서 값을 가져옵니다.
  const context = useOutletContext<LayoutContext>();
  
  // 혹시라도 context가 비어있을 경우를 대비해 기본값 'All' 설정
  const activeCategory = context?.activeCategory || 'All';

  // 2. 전체 웹사이트 데이터 상태 관리
  const [websites, setWebsites] = useState<Website[]>(initialWebsites);

  // 삭제 기능 (필요할 경우 사용)
  const handleDeleteWebsite = (id: string) => {
    setWebsites(prev => prev.filter(website => website.id !== id));
  };

  // 3. 필터링 로직 (핵심)
  // 카테고리가 'All'이면 전체를 보여주고, 아니면 해당 카테고리만 필터링
  const filteredWebsites = websites.filter((website) => {
    if (activeCategory === 'All') return true;
    return website.category === activeCategory;
  });

  return (
    <div className="flex flex-col min-h-screen text-slate-800 dark:text-slate-200">
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* 제목 섹션 */}
        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
          My Websites
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          지금까지 만든 프로젝트들입니다. (현재 카테고리: {activeCategory === 'All' ? '전체' : activeCategory})
        </p>
        
        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredWebsites.length > 0 ? (
            filteredWebsites.map(website => (
              <WebsiteCard 
                key={website.id} 
                website={website} 
                onDelete={handleDeleteWebsite} 
              />
            ))
          ) : (
            // 카드가 없을 경우 메시지
            <div className="col-span-full text-center py-20 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <p className="text-slate-500">'{activeCategory}' 카테고리에 등록된 웹사이트가 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Homepage;