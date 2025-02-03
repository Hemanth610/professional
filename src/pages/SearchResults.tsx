import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import RecipeList from '../components/RecipeList';

interface Recipe {
  id: number;
  title: string;
  image: string;
  summary: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
}

const SPOONACULAR_API_KEY = 'c1325a18d6fb4aaa961fcb24b7113510';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchRecipes = async () => {
      if (!query) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${query}&number=9&addRecipeInformation=true`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        
        const data = await response.json();
        
        if (data.status === 'failure') {
          throw new Error(data.message);
        }
        
        setRecipes(data.results || []);
      } catch (error: any) {
        console.error('Error searching recipes:', error);
        setError(error.message || 'Failed to search recipes');
      } finally {
        setLoading(false);
      }
    };

    searchRecipes();
  }, [query]);

  if (error) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="text-center py-12">
          <h2 className="text-xl text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackButton />
      
      <h1 className="text-3xl font-bold text-gray-800">
        Search Results for "{query}"
      </h1>
      
      <RecipeList recipes={recipes} loading={loading} />
    </div>
  );
};

export default SearchResults;