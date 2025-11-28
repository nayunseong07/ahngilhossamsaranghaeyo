import React, { useState }  from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';                   // 기존 푸터 컴포넌트 경로 맞춰주기


const Layout = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', '학업', '취미', '활동'];

  return (
    <div>
      <Header 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <Outlet />
      {/* <Outlet /> 이 부분에 페이지별 콘텐츠가 렌더링됩니다. */}
      <Footer />
    </div>
  );
};

export default Layout;