import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Layout = () => {
  // 여기서 관리하는 이 상태가 "진짜"입니다.
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', '학업', '취미', '활동'];

  return (
    <div>
      <Header 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Outlet을 통해 Homepage에 상태를 전달합니다 */}
      <Outlet context={{ activeCategory }} />

      <Footer />
    </div>
  );
};

export default Layout;