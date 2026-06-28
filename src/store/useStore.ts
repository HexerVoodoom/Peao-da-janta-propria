import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ProfileName,
  Profiles,
  HistoryEntry,
  CategoryWeights,
  FlavorWeights,
} from '../types';
import { DEFAULT_PROFILES, DEFAULT_WEIGHTS } from '../firebase/db';

interface AppStore {
  // Navigation
  currentPage: 'roulette' | 'profiles' | 'history';
  setCurrentPage: (page: 'roulette' | 'profiles' | 'history') => void;

  // Profiles
  profiles: Profiles;
  setProfiles: (profiles: Profiles) => void;
  toggleIngredientPreference: (
    profile: ProfileName,
    type: 'likes' | 'dislikes',
    ingredientId: string
  ) => void;

  // Roulette config
  participants: ProfileName[];
  setParticipants: (p: ProfileName[]) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  healthRange: [number, number];
  setHealthRange: (r: [number, number]) => void;

  // Weights
  categoryWeights: CategoryWeights;
  flavorWeights: FlavorWeights;
  setWeights: (c: CategoryWeights, f: FlavorWeights) => void;
  decreaseCategoryWeight: (id: string) => void;
  decreaseFlavorWeight: (catId: string, flavId: string) => void;
  resetWeights: () => void;

  // History
  history: HistoryEntry[];
  setHistory: (h: HistoryEntry[]) => void;
  addLocalHistory: (e: HistoryEntry) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      // Navigation
      currentPage: 'roulette',
      setCurrentPage: (page) => set({ currentPage: page }),

      // Profiles
      profiles: DEFAULT_PROFILES,
      setProfiles: (profiles) => set({ profiles }),
      toggleIngredientPreference: (profile, type, ingredientId) =>
        set((state) => {
          const current = state.profiles[profile][type];
          const opposite = type === 'likes' ? 'dislikes' : 'likes';
          const isSelected = current.includes(ingredientId);
          return {
            profiles: {
              ...state.profiles,
              [profile]: {
                ...state.profiles[profile],
                [type]: isSelected
                  ? current.filter((id) => id !== ingredientId)
                  : [...current, ingredientId],
                // Remove from opposite list if present
                [opposite]: state.profiles[profile][opposite].filter(
                  (id) => id !== ingredientId
                ),
              },
            },
          };
        }),

      // Roulette config
      participants: ['mateus', 'amanda'],
      setParticipants: (participants) => set({ participants }),
      priceRange: [1, 5],
      setPriceRange: (priceRange) => set({ priceRange }),
      healthRange: [1, 5],
      setHealthRange: (healthRange) => set({ healthRange }),

      // Weights
      categoryWeights: DEFAULT_WEIGHTS.categories,
      flavorWeights: DEFAULT_WEIGHTS.flavors,
      setWeights: (c, f) => set({ categoryWeights: c, flavorWeights: f }),
      decreaseCategoryWeight: (id) =>
        set((state) => ({
          categoryWeights: {
            ...state.categoryWeights,
            [id]: Math.max(0.05, (state.categoryWeights[id] ?? 1) * 0.5),
          },
        })),
      decreaseFlavorWeight: (catId, flavId) =>
        set((state) => ({
          flavorWeights: {
            ...state.flavorWeights,
            [catId]: {
              ...state.flavorWeights[catId],
              [flavId]: Math.max(0.05, (state.flavorWeights[catId]?.[flavId] ?? 1) * 0.5),
            },
          },
        })),
      resetWeights: () =>
        set({
          categoryWeights: DEFAULT_WEIGHTS.categories,
          flavorWeights: DEFAULT_WEIGHTS.flavors,
        }),

      // History
      history: [],
      setHistory: (history) => set({ history }),
      addLocalHistory: (entry) =>
        set((state) => ({ history: [entry, ...state.history] })),
    }),
    {
      name: 'peao-da-janta',
      partialize: (state) => ({
        profiles: state.profiles,
        participants: state.participants,
        priceRange: state.priceRange,
        healthRange: state.healthRange,
        categoryWeights: state.categoryWeights,
        flavorWeights: state.flavorWeights,
        history: state.history,
      }),
    }
  )
);
