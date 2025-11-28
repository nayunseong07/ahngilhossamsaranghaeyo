import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 파일 확장자(.tsx)까지 명확하게 적어줍니다.
import Layout from './src/Layout.tsx';
import SpaceShooter from './src/pages/SpaceShooter.tsx';
import Homepage from './src/Homepage.tsx';

function App() {
  return (
    <BrowserRouter basename='/ahngilhossamsaranghaeyo'>
       <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          {/* 여기에 새로운 페이지 라우트를 추가할 예정입니다. */}
          <Route path="/space-shooter" element={<SpaceShooter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;