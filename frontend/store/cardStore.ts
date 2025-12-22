import { create } from 'zustand';
import { Card, CardCreate, CardUpdate, CardImportRequest } from '@/types/card';
import { api } from '@/lib/api';

interface CardStore {
  cards: Card[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCards: () => Promise<void>;
  createCard: (card: CardCreate) => Promise<void>;
  updateCard: (title: string, update: CardUpdate) => Promise<void>;
  deleteCard: (title: string) => Promise<void>;
  importCards: (data: CardImportRequest) => Promise<{ imported: number; skipped: number; errors: string[] }>;
  moveCard: (title: string, newStatus: Card['status']) => Promise<void>;
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  isLoading: false,
  error: null,

  fetchCards: async () => {
    set({ isLoading: true, error: null });
    try {
      const cards = await api.getCards();
      set({ cards, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createCard: async (card: CardCreate) => {
    set({ error: null });
    try {
      const newCard = await api.createCard(card);
      set((state) => ({ cards: [...state.cards, newCard] }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateCard: async (title: string, update: CardUpdate) => {
    set({ error: null });
    try {
      const updatedCard = await api.updateCard(title, update);
      set((state) => ({
        cards: state.cards.map((card) =>
          card.title === title ? updatedCard : card
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteCard: async (title: string) => {
    set({ error: null });
    try {
      await api.deleteCard(title);
      set((state) => ({
        cards: state.cards.filter((card) => card.title !== title),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  importCards: async (data: CardImportRequest) => {
    set({ error: null });
    try {
      const result = await api.importCards(data);
      await get().fetchCards(); // Refresh cards after import
      return result;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  moveCard: async (title: string, newStatus: Card['status']) => {
    const card = get().cards.find((c) => c.title === title);
    if (!card) return;

    // Optimistic update
    set((state) => ({
      cards: state.cards.map((c) =>
        c.title === title ? { ...c, status: newStatus } : c
      ),
    }));

    try {
      await api.updateCard(title, { status: newStatus });
    } catch (error) {
      // Revert on error
      set((state) => ({
        cards: state.cards.map((c) =>
          c.title === title ? { ...c, status: card.status } : c
        ),
        error: (error as Error).message,
      }));
    }
  },
}));