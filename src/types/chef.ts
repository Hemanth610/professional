import { Recipe } from "./recipe";

export interface Chef {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  specialties: string[];
  followers: number;
  isFollowing?: boolean;
  signatureDishes: string[];
}

export interface ChefRecipe extends Recipe {
  isSpecial: boolean;
  chef: {
    username: string;
    fullName: string;
    avatarUrl: string;
  };
}