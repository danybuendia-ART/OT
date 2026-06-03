export interface Task {
  id: string;
  title: string;
  description: string;
  unit: string;
  quantity: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  assignedTo?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  createdAt: Date;
  completedAt?: Date;
  tasks: Task[];
}

export interface Material {
  id: string;
  projectId: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  status: 'en espera' | 'en camino' | 'entregado';
  createdAt: Date;
  updatedAt: Date;
}

export const DEMO_WORKERS = [
  'Carlos García',
  'María López',
  'Juan Martínez',
  'Ana Rodríguez',
  'Pedro Sánchez',
];
