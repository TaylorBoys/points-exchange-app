export interface User {
  id: string;
  name: string;
  phone: string;
  points: number;
  createdAt: string;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  points: number;
  stock: number;
  image: string;
  createdAt: string;
}

export interface PointHistory {
  id: string;
  userId: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  createdAt: string;
}

export interface Exchange {
  id: string;
  userId: string;
  giftId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  points: number;
  createdAt: string;
}

export interface TaskCompletion {
  id: string;
  taskId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
}

export interface AppState {
  users: User[];
  gifts: Gift[];
  pointHistories: PointHistory[];
  exchanges: Exchange[];
  tasks: Task[];
  taskCompletions: TaskCompletion[];
  currentUser: User | null;
  isAdmin: boolean;
}
