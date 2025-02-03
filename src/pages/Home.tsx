import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';

const FEATURED_RECIPES = [
  {
    id: 'butter-chicken',
    title: 'Butter Chicken',
    description: 'Creamy and rich butter chicken made with tender tandoori chicken in a makhani gravy',
    cookingTime: 60,
    servings: 4,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'North Indian',
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
      'Salt to taste'
    ],
    instructions: [
      'Marinate chicken with tandoori masala for 2 hours',
      'Cook marinated chicken in oven at 200°C for 20 minutes',
      'In a pan, sauté onions until golden',
      'Add ginger-garlic paste and cook for 2 minutes',
      'Add tomato puree and cook until oil separates',
      'Add cream, butter, and cooked chicken',
      'Simmer for 10-15 minutes',
      'Garnish with cream and serve hot'
    ]
  },
  {
    id: 'biryani',
    title: 'Hyderabadi Biryani',
    description: 'Authentic Hyderabadi biryani with aromatic basmati rice and tender meat',
    cookingTime: 90,
    servings: 6,
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Hyderabadi',
    ingredients: [
      '1 kg basmati rice',
      '1 kg lamb or chicken',
      '2 cups yogurt',
      '4 onions, sliced',
      'Saffron strands',
      'Whole spices (cardamom, cinnamon, cloves)',
      'Ginger-garlic paste',
      'Mint and coriander leaves',
      'Ghee',
      'Salt to taste'
    ],
    instructions: [
      'Marinate meat with yogurt and spices for 4 hours',
      'Cook rice with whole spices until 70% done',
      'Layer marinated meat and rice alternately',
      'Add saffron milk and ghee',
      'Seal the pot with dough',
      'Cook on low heat for 45 minutes',
      'Let it rest for 10 minutes',
      'Serve hot with raita'
    ]
  },
  {
    id: 'palak-paneer',
    title: 'Palak Paneer',
    description: 'Creamy spinach curry with fresh cottage cheese cubes, a vegetarian delight',
    cookingTime: 45,
    servings: 4,
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    cuisine: 'North Indian',
    ingredients: [
      '500g spinach leaves',
      '250g paneer (cottage cheese)',
      '2 onions, finely chopped',
      '2 tomatoes, pureed',
      '4 cloves garlic',
      '1-inch ginger',
      '2 green chilies',
      'Cumin seeds',
      'Garam masala',
      'Heavy cream'
    ],
    instructions: [
      'Blanch spinach and blend into a smooth paste',
      'Pan-fry paneer cubes until golden',
      'Sauté cumin seeds and garlic in oil',
      'Add onions and cook until translucent',
      'Add tomato puree and spices',
      'Mix in spinach paste and simmer',
      'Add paneer and cream',
      'Serve hot with naan bread'
    ]
  },
  {
    id: 'masala-dosa',
    title: 'Masala Dosa',
    description: 'Crispy rice and lentil crepe filled with spiced potato filling, a South Indian classic',
    cookingTime: 40,
    servings: 4,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    cuisine: 'South Indian',
    ingredients: [
      '2 cups rice',
      '1 cup urad dal',
      '4 potatoes',
      '2 onions',
      'Mustard seeds',
      'Curry leaves',
      'Turmeric powder',
      'Green chilies',
      'Ginger',
      'Oil for cooking'
    ],
    instructions: [
      'Soak rice and dal separately for 6 hours',
      'Grind into smooth batter and ferment overnight',
      'Boil and mash potatoes',
      'Prepare potato filling with spices',
      'Spread batter on hot griddle in circular motion',
      'Add oil and cook until crispy',
      'Place potato filling and fold',
      'Serve hot with coconut chutney and sambar'
    ]
  },
  {
    id: 'dal-makhani',
    title: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked overnight with rich spices and butter',
    cookingTime: 480,
    servings: 6,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Punjabi',
    ingredients: [
      '1 cup black lentils',
      '1/4 cup red kidney beans',
      '1 cup heavy cream',
      '4 tbsp butter',
      'Onions and tomatoes',
      'Ginger-garlic paste',
      'Whole spices',
      'Kashmiri red chili powder',
      'Kasoori methi',
      'Fresh cream for garnish'
    ],
    instructions: [
      'Soak lentils and beans overnight',
      'Pressure cook until soft',
      'Sauté onions and whole spices',
      'Add tomato puree and spices',
      'Simmer with lentils for 4-5 hours',
      'Add cream and butter',
      'Finish with kasoori methi',
      'Garnish with cream and serve'
    ]
  },
  {
    id: 'chole-bhature',
    title: 'Chole Bhature',
    description: 'Spicy chickpea curry served with deep-fried bread, a popular Punjabi breakfast',
    cookingTime: 60,
    servings: 4,
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cuisine: 'Punjabi',
    ingredients: [
      '2 cups chickpeas',
      '2 cups all-purpose flour',
      'Tea bags for color',
      'Onions and tomatoes',
      'Ginger-garlic paste',
      'Chole masala',
      'Yeast',
      'Oil for frying',
      'Fresh herbs',
      'Spices blend'
    ],
    instructions: [
      'Soak chickpeas overnight with tea bags',
      'Pressure cook with spices',
      'Prepare bhatura dough and let it rise',
      'Make thick gravy with onions and tomatoes',
      'Add cooked chickpeas and simmer',
      'Roll out bhature and deep fry',
      'Garnish chole with coriander',
      'Serve hot with onions and pickle'
    ]
  }
];

const Home = () => {
  useEffect(() => {
    // Store recipes in localStorage
    localStorage.setItem('recipes', JSON.stringify(FEATURED_RECIPES));
  }, []);

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
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Popular Recipes</h2>
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