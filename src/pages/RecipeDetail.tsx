import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, ChefHat, ShoppingCart } from 'lucide-react';
import BackButton from '../components/BackButton';
import RecipeComments from '../components/RecipeComments';

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  difficulty: string;
  imageUrl: string;
  cuisine: string;
  ingredients: string[];
  instructions: string[];
}

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = () => {
      setLoading(true);
      try {
        // Get recipes from localStorage
        const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        const foundRecipe = recipes.find((r: Recipe) => r.id === id);
        
        if (foundRecipe) {
          setRecipe(foundRecipe);
        } else {
          // If recipe not found, navigate to home
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id, navigate]);

  const handleBuyGroceries = () => {
    setShowGroceryList(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Recipe not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <BackButton />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {recipe.cuisine}
          </div>
        </div>
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{recipe.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{recipe.description}</p>

          <div className="flex items-center space-x-8 mb-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="h-6 w-6" />
              <span>{recipe.cookingTime} mins</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center space-x-2">
              <ChefHat className="h-6 w-6" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Ingredients</h2>
                <button
                  onClick={handleBuyGroceries}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Buy Groceries</span>
                </button>
              </div>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>

              {showGroceryList && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Grocery List Created!
                  </h3>
                  <p className="text-green-700">
                    Your ingredients have been added to the shopping cart. Choose your preferred grocery delivery service to proceed with the purchase.
                  </p>
                  <div className="mt-4 flex space-x-4">
                    <a
                      href="https://www.bigbasket.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-green-600 px-4 py-2 rounded border border-green-200 hover:bg-green-50 transition-colors"
                    >
                      BigBasket
                    </a>
                    <a
                      href="https://www.grofers.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-green-600 px-4 py-2 rounded border border-green-200 hover:bg-green-50 transition-colors"
                    >
                      Grofers
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex space-x-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="flex-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <RecipeComments recipeId={id || ''} />
    </div>
  );
};

export default RecipeDetail;