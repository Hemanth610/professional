import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import SearchResults from './pages/SearchResults';
import ChefProfile from './pages/ChefProfile';
import ExploreChefs from './pages/ExploreChefs';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/create" element={<CreateRecipe />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/chef/:username" element={<ChefProfile />} />
            <Route path="/chefs" element={<ExploreChefs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;