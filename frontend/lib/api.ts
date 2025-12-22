import { Card, CardCreate, CardUpdate, CardImportRequest, CardImportResponse } from '@/types/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mkr-msk.ru/api';

export const api = {
  async getCards(): Promise<Card[]> {
    const response = await fetch(`${API_URL}/cards`);
    if (!response.ok) throw new Error('Failed to fetch cards');
    return response.json();
  },

  async createCard(card: CardCreate): Promise<Card> {
    const response = await fetch(`${API_URL}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
    if (!response.ok) throw new Error('Failed to create card');
    return response.json();
  },

  async updateCard(title: string, update: CardUpdate): Promise<Card> {
    const response = await fetch(`${API_URL}/cards/${encodeURIComponent(title)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    if (!response.ok) throw new Error('Failed to update card');
    return response.json();
  },

  async deleteCard(title: string): Promise<void> {
    const response = await fetch(`${API_URL}/cards/${encodeURIComponent(title)}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete card');
  },

  async importCards(data: CardImportRequest): Promise<CardImportResponse> {
    const response = await fetch(`${API_URL}/cards/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to import cards');
    return response.json();
  },
};