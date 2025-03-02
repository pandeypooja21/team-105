
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  ownerId: string;
  code: string;
  language: string;
  participants: User[];
  messages: Message[];
  createdAt: number;
  hasSubscription: boolean;
  maxParticipants: number;
}

export type Language = 'javascript' | 'typescript' | 'python' | 'html' | 'css';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export interface RoomState {
  currentRoom: Room | null;
  isLoading: boolean;
  error: string | null;
}
