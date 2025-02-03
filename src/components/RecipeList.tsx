import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ExternalLink } from 'lucide-react';

interface Recipe {
  id: number;
  title: string;
  image: string;
  summary: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
}

interface Props {
  recipes: Recipe[];
  loading: boolean;
}

const RecipeList = ({ recipes, loading }: Props) => {
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No recipes found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
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
            <p className="text-gray-600 mb-4 line-clamp-2">
              {stripHtml(recipe.summary)}
            </p>
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
  );
};

export default RecipeList;