import { Task, Category } from '@/types';

const STORAGE_KEYS = {
  TASKS: 'todo-tasks',
  CATEGORIES: 'todo-categories',
} as const;

export const storage = {
  getTasks(): Task[] {
    if (typeof window === 'undefined') return [];
    try {
      const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!tasks) return [];
      return JSON.parse(tasks).map((task: Omit<Task, 'createdAt'> & { createdAt: string }) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  saveTasks(tasks: Task[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  getCategories(): Category[] {
    if (typeof window === 'undefined') return [];
    try {
      const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return categories ? JSON.parse(categories) : [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  },

  saveCategories(categories: Category[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  },

  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  },

  updateTask(taskId: string, updates: Partial<Task>): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      this.saveTasks(tasks);
    }
  },

  deleteTask(taskId: string): void {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    this.saveTasks(filteredTasks);
  },

  addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category);
    this.saveCategories(categories);
  },

  updateCategory(categoryId: string, updates: Partial<Category>): void {
    const categories = this.getCategories();
    const index = categories.findIndex(cat => cat.id === categoryId);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      this.saveCategories(categories);
    }
  },

  deleteCategory(categoryId: string): void {
    const categories = this.getCategories();
    const filteredCategories = categories.filter(cat => cat.id !== categoryId);
    this.saveCategories(filteredCategories);
    
    const tasks = this.getTasks();
    const updatedTasks = tasks.map(task => 
      task.categoryId === categoryId 
        ? { ...task, categoryId: 'uncategorized' }
        : task
    );
    this.saveTasks(updatedTasks);
  },
}; 