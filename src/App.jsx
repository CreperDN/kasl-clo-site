import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductPage from './ProductPage'; // новий компонент
import MainPage from './MainPage'; // перенесемо сюди твій нинішній код
import Favorites from './Favorites'; 

export default function App() {
  return (
    <Routes>
      <Route path="/browsing" element={<MainPage />} />
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  );
}
