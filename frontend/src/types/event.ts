export type Event = {
  id: number;
  creator_id: number;
  creator_username: string;
  title: string;
  description: string;
  location: string;
  genre: string | null;
  start_datetime: string;
  end_datetime: string | null;
  created_at: string;
  updated_at: string;
  participants_preview: string[];
  participants_count: number;
  participants: string[];
  is_joined: boolean;
};

export type EventCreatePayload = {
  title: string;
  description: string;
  location: string;
  genre?: string | null;
  start_datetime: string;
  end_datetime?: string | null;
};

export type EventUpdatePayload = {
  title?: string;
  description?: string;
  location?: string;
  genre?: string | null;
  start_datetime?: string;
  end_datetime?: string | null;
};