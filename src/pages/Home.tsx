import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';

const FEATURED_RECIPES = [
  {
    id: '1',
    title: 'Butter Chicken',
    description: 'Creamy and rich butter chicken made with tender tandoori chicken in a makhani gravy',
    cookingTime: 60,
    servings: 4,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'North Indian'
  },
  {
    id: '2',
    title: 'Hyderabadi Biryani',
    description: 'Authentic Hyderabadi biryani with aromatic basmati rice and tender meat',
    cookingTime: 90,
    servings: 6,
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Hyderabadi'
  },
  {
    id: '3',
    title: 'Masala Dosa',
    description: 'Crispy rice and lentil crepe filled with spiced potato filling',
    cookingTime: 45,
    servings: 4,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'South Indian'
  },
  {
    id: '4',
    title: 'Palak Paneer',
    description: 'Cottage cheese cubes in a creamy spinach gravy',
    cookingTime: 40,
    servings: 4,
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'North Indian'
  },
  {
    id: '5',
    title: 'Chole Bhature',
    description: 'Spiced chickpea curry served with deep-fried bread',
    cookingTime: 60,
    servings: 4,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Punjabi'
  },
  {
    id: '6',
    title: 'Mysore Masala Dosa',
    description: 'Crispy dosa with spicy red chutney and potato filling',
    cookingTime: 50,
    servings: 2,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'South Indian'
  },
  {
    id: '7',
    title: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked with butter and spices',
    cookingTime: 120,
    servings: 6,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Punjabi'
  },
  {
    id: '8',
    title: 'Vada Pav',
    description: 'Spiced potato fritter in a bun with chutneys',
    cookingTime: 45,
    servings: 4,
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Maharashtra'
  },
  {
    id: '9',
    title: 'Malai Kofta',
    description: 'Paneer and potato dumplings in rich creamy gravy',
    cookingTime: 60,
    servings: 4,
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'North Indian'
  }
];

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-96 rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          alt="Indian Cuisine"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Authentic Indian Recipes
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl">
              Explore a diverse collection of traditional Indian recipes from various regions
            </p>
            <Link
              to="/create"
              className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Share Your Recipe
            </Link>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Popular Recipes</h2>
          <div className="flex space-x-2">
            <Link
              to="/chefs"
              className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors"
            >
              Explore Chefs
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_RECIPES.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-48">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {recipe.cuisine}
                </div>
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
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    recipe.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;