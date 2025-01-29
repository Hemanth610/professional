export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  cuisine: string;
  imageUrl: string;
  videoUrl?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}