'use client';

import { useEffect } from 'react';
import { useCardStore } from '@/store/cardStore';
import Column from './Column';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
import Card from './Card';
import { CardStatus } from '@/types/card';

export default function Board() {
  const { cards, isLoading, error, fetchCards, deleteCard, moveCard } = useCardStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const cardTitle = active.id as string;
    const newStatus = over.id as CardStatus;

    const card = cards.find((c) => c.title === cardTitle);
    if (!card || card.status === newStatus) return;

    try {
      await moveCard(cardTitle, newStatus);
    } catch (error) {
      alert('Failed to move card');
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

  const activeCard = activeId ? cards.find((card) => card.title === activeId) : null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">mkr_kanban</h1>
          <p className="text-gray-600">AI-friendly Kanban board</p>
        </div>

        {/* Board */}
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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

          <DragOverlay>
            {activeCard ? <Card card={activeCard} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}