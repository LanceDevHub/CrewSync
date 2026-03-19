export type User = {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};