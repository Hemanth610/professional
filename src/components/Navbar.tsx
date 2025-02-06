import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ChefHat, Search, PlusCircle, User, LogOut, Users, Mic, MicOff } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  const startVoiceSearch = () => {
    try {
      // Check if the browser supports speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        if (recognitionRef.current) {  // Add this type guard
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = 'en-US';
  
          recognitionRef.current.onstart = () => {
            setIsListening(true);
          };
  
          recognitionRef.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            navigate(`/search?q=${encodeURIComponent(transcript)}`);
          };
  
          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
          };
  
          recognitionRef.current.onend = () => {
            setIsListening(false);
          };
  
          recognitionRef.current.start();
        }
      } else {
        alert('Speech recognition is not supported in your browser.');
      }
    } catch (error) {
      console.error('Error starting voice search:', error);
    }
  };

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-gray-800">Recipe Remix</span>
          </Link>

          <div className="flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes by name, ingredients, or cuisine..."
                className="w-full pl-10 pr-16 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                title={isListening ? "Stop voice search" : "Start voice search"}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5 text-orange-500 animate-pulse" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/chefs"
              className="flex items-center space-x-1 text-gray-600 hover:text-orange-500"
            >
              <Users className="h-5 w-5" />
              <span>Explore Chefs</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center space-x-1 text-gray-600 hover:text-orange-500"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Create Recipe</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-600 hover:text-orange-500"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-600 hover:text-orange-500"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;