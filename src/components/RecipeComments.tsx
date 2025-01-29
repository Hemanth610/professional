import React, { useState, useEffect } from 'react';
import { Star, StarOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

interface Comment {
  id: string;
  content: string;
  rating: number;
  user_id: string;
  created_at: string;
  user: {
    username: string;
  };
}

interface Props {
  recipeId: string;
}

const RecipeComments = ({ recipeId }: Props) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [recipeId]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:profiles(username)
        `)
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('comments').insert({
        recipe_id: recipeId,
        user_id: user.id,
        content: newComment,
        rating,
      });

      if (error) throw error;

      setNewComment('');
      setRating(5);
      loadComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Reviews & Comments</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {value <= rating ? (
                    <Star className="h-6 w-6 fill-current" />
                  ) : (
                    <StarOff className="h-6 w-6" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Share your experience, tips, or modifications..."
            />
          </div>

          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Post Review
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600">Please sign in to leave a review</p>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-600">No reviews yet. Be the first to review!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800">
                    {comment.user.username}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < comment.rating
                          ? 'text-orange-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeComments;