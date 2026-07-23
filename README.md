# Kasl-clo 

A frontend application for a clothing e-commerce platform. This is an independent, solo project built to showcase frontend development skills, integrating with a third-party API to deliver a seamless shopping experience.

## Overview

Kasl-clo is a frontend application designed to consume an external API and present a dynamic product catalog.

## Key Features & Implementations

Here is a summary of the technical features implemented in this project:

- **Third-Party API Integration**: Fetches and displays product data dynamically from an external API, handling loading states and data processing on the client side.
- **Dynamic Routing & Navigation**: Implemented robust client-side routing using `react-router-dom` to navigate between the Main Page, Product Pages, and Favorites.
- **Advanced Product Filtering (`Filters.jsx`)**: Built a comprehensive filtering system allowing users to sort and narrow down clothing items based on various criteria.
- **Interactive Image Galleries**:
  - **Carousels (`PhotoSwiper.jsx`)**: Integrated `Swiper` for smooth, touch-friendly product image sliders.
  - **Zoom & Pan (`LargeImageGallery.jsx`)**: Utilized `react-zoom-pan-pinch` to allow users to inspect clothing details up close in a dedicated gallery view.
- **Favorites System (`Favorites.jsx`, `setFavorite.jsx`)**: Implemented local state management to allow users to like and save products for later viewing.
- **Theme Customization (`toggleTheme.jsx`)**: Added support for Light/Dark mode transitions to enhance accessibility and user preference.
- **Optimized Performance**: Leveraged **Vite** for lightning-fast HMR (Hot Module Replacement) and optimized production builds.

## Tech Stack

- **Core**: React 19, Vite
- **Routing**: React Router v7
- **UI / Interactions**: 
  - `swiper` (for modern carousels)
  - `react-zoom-pan-pinch` (for image zooming capabilities)
- **Styling**: Vanilla CSS (modular and responsive design)
- **Data Handling**: `lz-string` 
