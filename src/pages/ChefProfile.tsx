import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Chef } from '../types/chef';
import { Recipe } from '../types/recipe';
import { useAuthStore } from '../store/useAuthStore';
import { ChefHat, Clock, Users, Heart, BookMarked } from 'lucide-react';
import BackButton from '../components/BackButton';

const FEATURED_CHEFS: Chef[] = [
  {
    id: '1',
    username: 'afreen',
    fullName: 'Afreen',
    bio: 'Passionate about creating authentic North Indian cuisine with a modern twist. Specializing in rich, aromatic curries and tandoor dishes.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    specialties: ['North Indian', 'Mughlai', 'Tandoor Specialties'],
    followers: 1200,
    signatureDishes: [
      'Butter Chicken',
      'Rogan Josh',
      'Biryani',
      'Naan Varieties',
      'Dal Makhani'
    ]
  },
  {
    id: '2',
    username: 'durgabhavani',
    fullName: 'Durga Bhavani',
    bio: 'Expert in traditional South Indian cuisine, focusing on authentic Andhra and Telugu dishes. Known for spicy and flavorful preparations.',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    specialties: ['Andhra Cuisine', 'South Indian', 'Telugu Specialties'],
    followers: 980,
    signatureDishes: [
      'Hyderabadi Biryani',
      'Gongura Pachadi',
      'Andhra Chicken Curry',
      'Pesarattu',
      'Gutti Vankaya Curry'
    ]
  },
  {
    id: '3',
    username: 'shalini',
    fullName: 'Shalini',
    bio: 'Specializing in vegetarian Indian street food and regional specialties. Creating healthy versions of traditional favorites.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    specialties: ['Street Food', 'Vegetarian', 'Regional Cuisine'],
    followers: 1500,
    signatureDishes: [
      'Pani Puri',
      'Dahi Bhalla',
      'Samosa Chaat',
      'Bhel Puri',
      'Vada Pav'
    ]
  }
];

const SAMPLE_RECIPES = [
  {
    id: '1',
    title: 'Classic Butter Chicken',
    description: 'Rich and creamy butter chicken made with tender tandoori chicken pieces in a makhani gravy',
    cookingTime: 60,
    servings: 4,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isSpecial: true
  },
  {
    id: '2',
    title: 'Hyderabadi Biryani',
    description: 'Aromatic and flavorful biryani made with basmati rice, tender meat, and authentic spices',
    cookingTime: 90,
    servings: 6,
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isSpecial: true
  }
];

const ChefProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuthStore();
  const [chef, setChef] = useState<Chef | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChefProfile = async () => {
      setLoading(true);
      try {
        const foundChef = FEATURED_CHEFS.find(c => c.username === username);
        if (foundChef) {
          setChef(foundChef);
          // For demo, using sample recipes
          setRecipes(SAMPLE_RECIPES);
        }
      } catch (error) {
        console.error('Error loading chef profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChefProfile();
  }, [username]);

  const handleFollow = async () => {
    if (!user) return;
    setIsFollowing(!isFollowing);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Chef not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <BackButton />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="absolute -bottom-16 left-8">
            <img
              src={chef.avatarUrl}
              alt={chef.fullName}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{chef.fullName}</h1>
              <p className="text-gray-600">@{chef.username}</p>
            </div>
            {user && (
              <button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-full ${
                  isFollowing
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-orange-500 text-white'
                } font-semibold transition-colors`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="mt-6">
            <p className="text-gray-700 text-lg">{chef.bio}</p>
          </div>

          <div className="mt-6 flex items-center space-x-8 text-gray-600">
            <div>
              <span className="font-semibold text-gray-800">{chef.followers}</span>{' '}
              Followers
            </div>
            <div>
              <span className="font-semibold text-gray-800">{recipes.length}</span>{' '}
              Recipes
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Specialties</h2>
            <div className="flex flex-wrap gap-3">
              {chef.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Signature Dishes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chef.signatureDishes.map((dish, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                >
                  <ChefHat className="h-6 w-6 text-orange-500 mb-2" />
                  <p className="font-medium text-gray-800">{dish}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Featured Recipes
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                    {recipe.isSpecial && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Chef's Special
                      </div>
                    )}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefProfile;