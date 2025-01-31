import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, ChefHat, ShoppingCart } from 'lucide-react';
import BackButton from '../components/BackButton';
import RecipeComments from '../components/RecipeComments';

const RecipeDetail = () => {
  const { id } = useParams();
  const [showGroceryList, setShowGroceryList] = useState(false);

  // TODO: Fetch recipe details from Supabase
  const recipe = {
    title: 'Butter Chicken',
    description: 'Creamy and rich butter chicken made with tender tandoori chicken in a makhani gravy',
    cookingTime: 60,
    servings: 4,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: 'Afreen',
    authorUsername: 'afreen',
    ingredients: [
      '800g chicken thighs, boneless',
      '2 cups tomato puree',
      '1 cup heavy cream',
      '2 tbsp butter',
      '2 tbsp oil',
      '2 onions, finely chopped',
      '2 tbsp ginger-garlic paste',
      '2 tbsp tandoori masala',
      '1 tsp garam masala',
      'Salt to taste',
    ],
    instructions: [
      'Marinate chicken with tandoori masala for 2 hours',
      'Cook marinated chicken in oven at 200°C for 20 minutes',
      'In a pan, sauté onions until golden',
      'Add ginger-garlic paste and cook for 2 minutes',
      'Add tomato puree and cook until oil separates',
      'Add cream, butter, and cooked chicken',
      'Simmer for 10-15 minutes',
      'Garnish with cream and serve hot',
    ],
  };

  const handleBuyGroceries = () => {
    setShowGroceryList(true);
    // In a real app, this would integrate with a grocery delivery service
  };

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
              <span>{recipe.author}</span>
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