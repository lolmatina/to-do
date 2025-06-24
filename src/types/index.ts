export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  categoryId: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type ViewMode = 'list' | 'kanban';

export type SortBy = 'date' | 'alphabet' | 'status';

export interface AppState {
  tasks: Task[];
  categories: Category[];
  viewMode: ViewMode;
  sortBy: SortBy;
  filterStatus: TaskStatus | 'all';
  filterCategory: string | 'all';
} 