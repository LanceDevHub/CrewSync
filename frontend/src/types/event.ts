export type Event = {
  id: number;
  creator_id: number;
  title: string;
  description: string;
  location: string;
  genre: string | null;
  event_date: string;
  max_participants: number | null;
  created_at: string;
  updated_at: string;
};

export type EventCreatePayload = {
  title: string;
  description: string;
  location: string;
  genre?: string | null;
  event_date: string;
  max_participants?: number | null;
};

export type EventUpdatePayload = {
  title?: string;
  description?: string;
  location?: string;
  genre?: string | null;
  event_date?: string;
  max_participants?: number | null;
};