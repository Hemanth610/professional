import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ChefHat } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }

    if (isSignUp) {
      const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.[!@#$%^&])[A-Za-z!@#$%^&*]+$/;
      if (!passwordRegex.test(password)) {
        setError('Password must contain at least one uppercase letter, one lowercase letter, and one special character.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password);
        setError('Registration successful. Please check your email to verify your account');
        navigate('/home');
      } else {
        await signIn(email, password);
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="relative group perspective-1000">
        {/* 3D Container */}
        <div className={transform transition-transform duration-700 ${isSignUp ? 'rotate-y-180' : ''} w-full}>
          {/* Main form content */}
          <div className="bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-500 ease-in-out group-hover:scale-105">
            <div className="flex justify-center mb-8">
              <ChefHat className="h-12 w-12 text-orange-500" />
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors duration-300 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin border-4 border-t-4 border-orange-500 rounded-full h-5 w-5"></div>
                  </div>
                ) : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-orange-500 hover:text-orange-700 transition-colors duration-300 ease-in-out"
              >
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;