import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductPage from './ProductPage'; // новий компонент
import MainPage from './MainPage'; // перенесемо сюди твій нинішній код
import Favorites from './Favorites'; 
import ErrorBoundary from './ErrorBoundary';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ErrorBoundary><MainPage /></ErrorBoundary>} />
      <Route path="/product/:slug" element={<ErrorBoundary><ProductPage /></ErrorBoundary>} />
      <Route path="/favorites" element={<ErrorBoundary><Favorites /></ErrorBoundary>} />
    </Routes>
  );
}
