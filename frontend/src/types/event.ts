export type EventParticipantPreview = {
  username: string;
  first_name: string;
  last_name: string;
};

export type Event = {
  id: number;
  creator_id: number;
  creator_username: string;
  title: string;
  lineup: string;
  official_link?: string | null;
  location: string;
  start_datetime: string;
  end_datetime: string | null;
  created_at: string;
  updated_at: string;
  participants_preview: EventParticipantPreview[];
  participants_count: number;
  participants: EventParticipantPreview[];
  is_joined: boolean;
};

export type EventCreatePayload = {
  title: string;
  lineup: string;
  official_link?: string | null;
  location: string;
  start_datetime: string;
  end_datetime?: string | null;
};

export type EventUpdatePayload = {
  title?: string;
  lineup?: string;
  official_link?: string | null;
  location?: string;
  start_datetime?: string;
  end_datetime?: string | null;
};