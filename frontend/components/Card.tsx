import { Card as CardType } from '@/types/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CardProps {
  card: CardType;
  onDelete?: (title: string) => void;
}

const priorityColors = {
  P0: 'bg-red-100 text-red-800 border-red-300',
  P1: 'bg-orange-100 text-orange-800 border-orange-300',
  P2: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  P3: 'bg-gray-100 text-gray-800 border-gray-300',
};

export default function Card({ card, onDelete }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.title });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      {/* Priority badge */}
      <div className="flex items-start justify-between mb-2">
        <span className={`px-2 py-1 text-xs font-semibold rounded border ${priorityColors[card.priority]}`}>
          {card.priority}
        </span>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.title);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Delete card"
          >
            ✕
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>

      {/* Description */}
      {card.description && (
        <p className="text-sm text-gray-600 line-clamp-3">{card.description}</p>
      )}
    </div>
  );
}