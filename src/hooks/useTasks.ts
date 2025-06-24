import { useState, useEffect } from 'react';
import { Task, Category, ViewMode, SortBy, TaskStatus } from '@/types';
import { storage } from '@/lib/storage';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');

  useEffect(() => {
    const loadedTasks = storage.getTasks();
    const loadedCategories = storage.getCategories();
    
    if (loadedCategories.length === 0) {
      const defaultCategories: Category[] = [
        { id: 'uncategorized', name: 'Без категории', color: '#6B7280' },
        { id: 'work', name: 'Работа', color: '#3B82F6' },
        { id: 'personal', name: 'Личное', color: '#10B981' },
      ];
      setCategories(defaultCategories);
      storage.saveCategories(defaultCategories);
    } else {
      setCategories(loadedCategories);
    }
    
    setTasks(loadedTasks);
  }, []);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
  };

  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId ? { ...cat, ...updates } : cat
    );
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
  };

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
    
    const updatedTasks = tasks.map(task =>
      task.categoryId === categoryId
        ? { ...task, categoryId: 'uncategorized' }
        : task
    );
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = tasks;

    if (filterStatus !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
    }

    if (filterCategory !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.categoryId === filterCategory);
    }

    filteredTasks.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'alphabet':
          return a.title.localeCompare(b.title);
        case 'status':
          const statusOrder = { 'pending': 0, 'in-progress': 1, 'completed': 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

    return filteredTasks;
  };

  const getTasksByCategory = () => {
    const filteredTasks = getFilteredAndSortedTasks();
    const tasksByCategory: Record<string, Task[]> = {};

    categories.forEach(category => {
      tasksByCategory[category.id] = filteredTasks.filter(
        task => task.categoryId === category.id
      );
    });

    return tasksByCategory;
  };

  return {
    tasks,
    categories,
    viewMode,
    sortBy,
    filterStatus,
    filterCategory,
    
    addTask,
    updateTask,
    deleteTask,
    addCategory,
    updateCategory,
    deleteCategory,
    
    setViewMode,
    setSortBy,
    setFilterStatus,
    setFilterCategory,
    
    getFilteredAndSortedTasks,
    getTasksByCategory,
  };
}; 