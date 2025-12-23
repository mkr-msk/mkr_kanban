import { Card as CardType, CardStatus } from '@/types/card';
import Card from './Card';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface ColumnProps {
  title: string;
  status: CardStatus;
  cards: CardType[];
  onDeleteCard?: (title: string) => void;
}

const columnColors = {
  todo: 'bg-gray-50 border-gray-300',
  in_progress: 'bg-blue-50 border-blue-300',
  done: 'bg-green-50 border-green-300',
};

export default function Column({ title, status, cards, onDeleteCard }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const cardIds = cards.map((card) => card.title);

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[300px] rounded-lg border-2 ${columnColors[status]} ${
        isOver ? 'ring-2 ring-blue-400' : ''
      } p-4 transition-all`}
    >
      {/* Column header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-600">{cards.length} cards</span>
      </div>

      {/* Cards list */}
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px]">
          {cards.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No cards</p>
          ) : (
            cards.map((card) => (
              <Card key={card.title} card={card} onDelete={onDeleteCard} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}