import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, Users, ChefHat, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Recipe } from '../types/recipe';
import BackButton from '../components/BackButton';

interface OnlineRecipe {
  id: string;
  title: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  sourceUrl: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [onlineRecipes, setOnlineRecipes] = useState<OnlineRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        // Search local recipes
        const { data: localData, error: localError } = await supabase
          .from('recipes')
          .select(`
            *,
            author:profiles(username)
          `)
          .or(`
            title.ilike.%${query}%,
            description.ilike.%${query}%,
            cuisine.ilike.%${query}%,
            category.ilike.%${query}%
          `)
          .order('created_at', { ascending: false });

        if (localError) throw localError;
        setRecipes(localData || []);

        // Search online recipes using Spoonacular API
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=25a2345318174f1bb0277e094473edfc&query=${query}&number=6&addRecipeInformation=true`
        );
        const data = await response.json();
        
        if (data.status === 'failure') {
          throw new Error(data.message);
        }
        
        setOnlineRecipes(data.results || []);
      } catch (error: any) {
        console.error('Error searching recipes:', error);
        setError(error.message || 'Failed to search recipes');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      searchRecipes();
    }
  }, [query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

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
      
      {recipes.length === 0 && onlineRecipes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600 mb-4">No recipes found</h2>
          <p className="text-gray-500">Try searching with different keywords</p>
        </div>
      ) : (
        <>
          {recipes.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Community Recipes</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/recipe/${recipe.id}`}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{recipe.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{recipe.cookingTime} mins</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{recipe.servings} servings</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ChefHat className="h-4 w-4" />
                          <span>{recipe.author?.username || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {onlineRecipes.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Online Recipes</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {onlineRecipes.map((recipe) => (
                  <a
                    key={recipe.id}
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <ExternalLink className="h-5 w-5 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{recipe.readyInMinutes} mins</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{recipe.servings} servings</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;