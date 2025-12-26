import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 파일 확장자(.tsx)까지 명확하게 적어줍니다.
import Layout from './src/Layout.tsx';
import SpaceShooter from './src/pages/SpaceShooter.tsx';
import Homepage from './src/Homepage.tsx';
import Space from './src/pages/space.tsx';
import Voca from './src/pages/voca/voca.tsx';
import Mole from './src/pages/mole.tsx';
import Please from './src/pages/please.tsx';
import Camera from './src/pages/camera.tsx';
import Calendar from './src/pages/calendar.tsx';
import Ladder from './src/pages/ladder.tsx';
import Emoji from './src/pages/emoji.tsx';
import Food from './src/pages/food.tsx';

function App() {
  return (
    <BrowserRouter basename="/ahngilhossamsaranghaeyo">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="space-shooter" element={<SpaceShooter />} />
          <Route path="space" element={<Space />} />
          <Route path="voca" element={<Voca />} />
          <Route path="mole" element={<Mole />} />
          <Route path="please" element={<Please />} />
          <Route path="camera" element={<Camera />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="ladder" element={<Ladder />} />
          <Route path="emoji" element={<Emoji />} />
          <Route path="food" element={<Food />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
