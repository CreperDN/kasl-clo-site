import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductPage from './ProductPage'; // новий компонент
import MainPage from './MainPage2'; // перенесемо сюди твій нинішній код

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/product/:slug" element={<ProductPage />} />
    </Routes>
  );
}
