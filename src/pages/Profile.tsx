import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Clock, Users, Camera, Lock, Bell, Trash2, Eye, LogOut, Video, Plus } from 'lucide-react';
import type { Recipe } from '../types/recipe';

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile } = useAuthStore();
  
  // State variables for managing component behavior
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  // Form states for editing user profile
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    email_notifications: false,
    is_public: true
  });

  // Load user data and recipes when the user is available
  useEffect(() => {
    if (user) {
      setLoading(false);
      const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
      const userRecipes = recipes.filter((recipe: Recipe) => recipe.authorId === user.id);
      setUserRecipes(userRecipes);
    }
  }, [user]);

  // Populate form fields with profile data
  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        email_notifications: profile.email_notifications || false,
        is_public: profile.is_public !== false
      });
    }
  }, [profile]);

  // Handle avatar image upload
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      // Convert image file to data URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await updateProfile({ avatar_url: reader.result as string });
          setMessage('Profile picture updated successfully');
          setTimeout(() => setMessage(''), 3000);
        } catch (error) {
          console.error('Error updating avatar:', error);
          setMessage('Error updating profile picture');
          setTimeout(() => setMessage(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error handling avatar:', error);
      setMessage('Error updating profile picture');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const users = JSON.parse(localStorage.getItem('LOCAL_USERS_KEY') || '{}');
      if (user?.email) {
        users[user.email].password = newPassword;
        localStorage.setItem('LOCAL_USERS_KEY', JSON.stringify(users));
      }
      setShowPasswordChange(false);
      setCurrentPassword('');
      setNewPassword('');
      setMessage('Password updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Error updating password');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      if (user) {
        const users = JSON.parse(localStorage.getItem('LOCAL_USERS_KEY') || '{}');
        if (user.email) {
          delete users[user.email];
          localStorage.setItem('LOCAL_USERS_KEY', JSON.stringify(users));
        }
        
        const profiles = JSON.parse(localStorage.getItem('recipe_remix_profiles') || '{}');
        delete profiles[user.id];
        localStorage.setItem('recipe_remix_profiles', JSON.stringify(profiles));
      }
      
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage('Error deleting account');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Show sign-in prompt if user is not logged in
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please sign in to view your profile</h2>
        <Link to="/auth" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">Sign In</Link>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {message && <div className="mb-4 p-4 rounded-lg bg-orange-100 text-orange-700">{message}</div>}
      
      {/* Profile Information & Editing */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        {/* Profile Avatar and Edit Form */}
        {/* Add your UI components here */}
      </div>
      
      {/* User Recipes Section */}
      {/* Add UI to display user's recipes */}
      
      {/* Account Settings */}
      {/* Add buttons for password change and account deletion */}
    </div>
  );
};

export default Profile;
