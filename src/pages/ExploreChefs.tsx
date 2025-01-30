import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Users } from 'lucide-react';
import BackButton from '../components/BackButton';

const FEATURED_CHEFS = [
  {
    username: 'afreen',
    fullName: 'Afreen',
    bio: 'Passionate about creating authentic North Indian cuisine with a modern twist.',
    specialty: 'North Indian & Mughlai',
    followers: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    featuredRecipe: {
      title: 'Butter Chicken',
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  },
  {
    username: 'durgabhavani',
    fullName: 'Durga Bhavani',
    bio: 'Expert in traditional South Indian cuisine, focusing on authentic Andhra and Telugu dishes.',
    specialty: 'South Indian & Telugu',
    followers: 980,
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    featuredRecipe: {
      title: 'Hyderabadi Biryani',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  },
  {
    username: 'shalini',
    fullName: 'Shalini',
    bio: 'Specializing in vegetarian Indian street food and regional specialties.',
    specialty: 'Street Food & Regional',
    followers: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    featuredRecipe: {
      title: 'Street Style Pani Puri',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  }
];

const ExploreChefs = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <BackButton />

      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Explore Our Featured Chefs
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Discover talented chefs specializing in authentic Indian cuisine
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_CHEFS.map((chef) => (
            <Link
              key={chef.username}
              to={`/chef/${chef.username}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="relative h-48">
                <img
                  src={chef.featuredRecipe.imageUrl}
                  alt={chef.featuredRecipe.title}
                  className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={chef.imageUrl}
                    alt={chef.fullName}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {chef.fullName}
                  </h2>
                  <p className="text-orange-500 font-medium">{chef.specialty}</p>
                </div>

                <p className="text-gray-600 text-center mb-4 line-clamp-2">
                  {chef.bio}
                </p>

                <div className="flex items-center justify-center space-x-6 text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-5 w-5" />
                    <span>{chef.followers} followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ChefHat className="h-5 w-5" />
                    <span>View Recipes</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreChefs;