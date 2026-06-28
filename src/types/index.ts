export type ProfileName = 'mateus' | 'amanda';

export type IngredientCategory =
  | 'verdura'
  | 'legume'
  | 'fruta'
  | 'carne'
  | 'derivado'
  | 'carboidrato'
  | 'outro';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  emoji: string;
}

export interface Flavor {
  id: string;
  name: string;
  emoji: string;
  ingredients: string[];
}

export interface FoodCategory {
  id: string;
  name: string;
  emoji: string;
  priceLevel: number;
  healthLevel: number;
  relatedIngredients: string[];
  flavors: Flavor[];
}

export interface Profile {
  likes: string[];
  dislikes: string[];
}

export interface Profiles {
  mateus: Profile;
  amanda: Profile;
}

export interface HistoryEntry {
  id: string;
  date: string;
  participants: ProfileName[];
  category: string;
  categoryEmoji: string;
  flavor: string;
  flavorEmoji: string;
  restaurant: string;
  price: number;
  rating: number;
}

export type SpinStage =
  | 'idle'
  | 'category-spinning'
  | 'category-result'
  | 'flavor-spinning'
  | 'flavor-result'
  | 'entry-form';

export interface CategoryWeights {
  [categoryId: string]: number;
}

export interface FlavorWeights {
  [categoryId: string]: {
    [flavorId: string]: number;
  };
}
