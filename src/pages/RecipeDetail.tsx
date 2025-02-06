import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, ChefHat, ShoppingCart as CartIcon, Volume2, VolumeX } from 'lucide-react';
import BackButton from '../components/BackButton';
import RecipeComments from '../components/RecipeComments';
import ShoppingCart from '../components/ShoppingCart';
import VoiceAssistant from '../components/VoiceAssistant'; // Import VoiceAssistant
import { useCartStore } from '../store/useCartStore';
import { formatINR } from '../utils/currency';

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

const INGREDIENT_PRICES: Record<string, { price: number; unit: string }> = {
  'chicken thighs': { price: 4.99, unit: 'kg' },
  'tomato puree': { price: 1.99, unit: 'pack' },
  'heavy cream': { price: 2.99, unit: 'pack' },
  'butter': { price: 3.49, unit: 'pack' },
  'onions': { price: 0.99, unit: 'kg' },
  'ginger-garlic paste': { price: 1.99, unit: 'jar' },
  'tandoori masala': { price: 2.49, unit: 'pack' },
  'garam masala': { price: 2.49, unit: 'pack' },
  'basmati rice': { price: 5.99, unit: 'kg' },
  'yogurt': { price: 1.99, unit: 'kg' },
  'saffron': { price: 12.99, unit: 'gram' },
  'mint': { price: 0.99, unit: 'bunch' },
  'coriander': { price: 0.99, unit: 'bunch' },
  'ghee': { price: 6.99, unit: 'kg' },
  'spinach': { price: 1.99, unit: 'kg' },
  'paneer': { price: 3.99, unit: 'kg' },
  'cumin seeds': { price: 1.99, unit: 'pack' },
  'green chilies': { price: 0.49, unit: 'pack' },
};

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addItem, items } = useCartStore();

  useEffect(() => {
    const loadRecipe = () => {
      setLoading(true);
      try {
        const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        console.log('All recipes:', recipes);
        
        const foundRecipe = recipes.find((r: Recipe) => r.id === id);
        console.log('Found recipe:', foundRecipe);
        
        if (foundRecipe) {
          setRecipe(foundRecipe);
        } else {
          console.log('Recipe not found with id:', id);
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

  const handleAddToCart = (ingredient: string) => {
    const normalizedIngredient = Object.keys(INGREDIENT_PRICES).find(
      (key) => ingredient.toLowerCase().includes(key.toLowerCase())
    );

    if (normalizedIngredient) {
      const { price, unit } = INGREDIENT_PRICES[normalizedIngredient];
      addItem({
        id: normalizedIngredient,
        name: ingredient,
        price,
        quantity: 1,
        unit,
      });
    }
  };

  const isInCart = (ingredient: string) => {
    const normalizedIngredient = Object.keys(INGREDIENT_PRICES).find(
      (key) => ingredient.toLowerCase().includes(key.toLowerCase())
    );
    return items.some((item) => item.id === normalizedIngredient);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <BackButton />
      </div>

      <VoiceAssistant 
        onSearch={(query) => {
          // Handle search
          console.log('Searching:', query);
        }}
        recipeToRead={recipe}
      />

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
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <CartIcon className="h-5 w-5" />
                  <span>View Cart</span>
                </button>
              </div>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => {
                  const normalizedIngredient = Object.keys(INGREDIENT_PRICES).find(
                    (key) => ingredient.toLowerCase().includes(key.toLowerCase())
                  );
                  const price = normalizedIngredient ? INGREDIENT_PRICES[normalizedIngredient].price : null;

                  return (
                    <li key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span>{ingredient}</span>
                      </div>
                      {price && (
                        <button
                          onClick={() => handleAddToCart(ingredient)}
                          disabled={isInCart(ingredient)}
                          className={`text-sm px-3 py-1 rounded-full transition-colors ${
                            isInCart(ingredient)
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                        >
                          {isInCart(ingredient) ? 'Added' : formatINR(price)}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
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
      
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default RecipeDetail;