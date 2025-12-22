export type CardStatus = 'todo' | 'in_progress' | 'done';
export type CardPriority = 'P0' | 'P1' | 'P2' | 'P3';

export interface Card {
  title: string;
  description?: string;
  status: CardStatus;
  priority: CardPriority;
  position: number;
  project_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CardCreate {
  title: string;
  description?: string;
  status?: CardStatus;
  priority?: CardPriority;
}

export interface CardUpdate {
  description?: string;
  status?: CardStatus;
  priority?: CardPriority;
  position?: number;
}

export interface CardImportRequest {
  cards: {
    title: string;
    description?: string;
    status?: CardStatus;
    priority?: CardPriority;
  }[];
}

export interface CardImportResponse {
  imported: number;
  skipped: number;
  errors: string[];
}