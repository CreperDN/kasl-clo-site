import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductPage from './ProductPage'; // новий компонент
import MainPage from './MainPage'; // перенесемо сюди твій нинішній код

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
    </Routes>
  );
}
