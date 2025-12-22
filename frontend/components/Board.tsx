'use client';

import { useEffect } from 'react';
import { useCardStore } from '@/store/cardStore';
import Column from './Column';

export default function Board() {
  const { cards, isLoading, error, fetchCards, deleteCard } = useCardStore();

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleDeleteCard = async (title: string) => {
    if (confirm(`Delete card "${title}"?`)) {
      try {
        await deleteCard(title);
      } catch (error) {
        alert('Failed to delete card');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading cards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  const todoCards = cards.filter((card) => card.status === 'todo');
  const inProgressCards = cards.filter((card) => card.status === 'in_progress');
  const doneCards = cards.filter((card) => card.status === 'done');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">mkr_kanban</h1>
          <p className="text-gray-600">AI-friendly Kanban board</p>
        </div>

        {/* Board */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          <Column
            title="To Do"
            status="todo"
            cards={todoCards}
            onDeleteCard={handleDeleteCard}
          />
          <Column
            title="In Progress"
            status="in_progress"
            cards={inProgressCards}
            onDeleteCard={handleDeleteCard}
          />
          <Column
            title="Done"
            status="done"
            cards={doneCards}
            onDeleteCard={handleDeleteCard}
          />
        </div>
      </div>
    </div>
  );
}