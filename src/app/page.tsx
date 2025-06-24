'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task, Category, TaskStatus, SortBy } from '@/types';
import { ListView } from '@/components/ListView';
import { KanbanView } from '@/components/KanbanView';
import { TaskForm } from '@/components/TaskForm';
import { CategoryForm } from '@/components/CategoryForm';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function HomePage() {
  const {
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
  } = useTasks();

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'task' | 'category';
    id: string;
    title: string;
  } | null>(null);

  const filteredTasks = getFilteredAndSortedTasks();

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      addTask(taskData);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const task = filteredTasks.find(t => t.id === taskId);
    if (task) {
      setDeleteConfirm({
        type: 'task',
        id: taskId,
        title: task.title
      });
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleCategorySubmit = (categoryData: Omit<Category, 'id'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
      setEditingCategory(null);
    } else {
      addCategory(categoryData);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && categoryId !== 'uncategorized') {
      setDeleteConfirm({
        type: 'category',
        id: categoryId,
        title: category.name
      });
    }
  };

  const handleMoveTask = (taskId: string, newCategoryId: string) => {
    updateTask(taskId, { categoryId: newCategoryId });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      if (deleteConfirm.type === 'task') {
        deleteTask(deleteConfirm.id);
      } else {
        deleteCategory(deleteConfirm.id);
      }
      setDeleteConfirm(null);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Все статусы' },
    { value: 'pending', label: 'Ожидает' },
    { value: 'in-progress', label: 'В процессе' },
    { value: 'completed', label: 'Завершено' },
  ];

  const sortOptions = [
    { value: 'date', label: 'По дате' },
    { value: 'alphabet', label: 'По алфавиту' },
    { value: 'status', label: 'По статусу' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Управление задачами
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Организуйте свои задачи с помощью списков и канбан-досок
            </p>
          </div>
          
          <div className="space-y-6">
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              
              <div className="flex justify-center lg:justify-start">
                <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-200">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Список
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      viewMode === 'kanban'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17H7a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v2m3 0h4a2 2 0 012 2v8a2 2 0 01-2 2h-4m-3-10V5a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m3 0V5" />
                    </svg>
                    Канбан
                  </button>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end gap-4 text-sm md:text-base">
                <button
                  onClick={() => setIsTaskFormOpen(true)}
                  className="flex items-center gap-1 px-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Создать задачу</span>
                </button>
                <button
                  onClick={() => setIsCategoryFormOpen(true)}
                  className="flex items-center gap-1 px-2 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Создать категорию</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 appearance-none pr-10 font-medium text-gray-900 shadow-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 appearance-none pr-10 font-medium text-gray-900 shadow-sm"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 appearance-none pr-10 font-medium text-gray-900 shadow-sm"
                >
                  <option value="all">Все категории</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {categories.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Категории
              </h3>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                  >
                    <div
                      className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-800">{category.name}</span>
                    {category.id !== 'uncategorized' && (
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                          title="Редактировать"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                          title="Удалить"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 lg:p-8">
            {viewMode === 'list' ? (
              <ListView
                tasks={filteredTasks}
                categories={categories}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ) : (
              <KanbanView
                tasks={filteredTasks}
                categories={categories}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onMoveTask={handleMoveTask}
              />
            )}
          </div>
        </div>
      </div>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        categories={categories}
        editingTask={editingTask}
      />

      <CategoryForm
        isOpen={isCategoryFormOpen}
        onClose={() => {
          setIsCategoryFormOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCategorySubmit}
        editingCategory={editingCategory}
      />

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        title={`Удалить ${deleteConfirm?.type === 'task' ? 'задачу' : 'категорию'}`}
        message={`Вы уверены, что хотите удалить ${
          deleteConfirm?.type === 'task' ? 'задачу' : 'категорию'
        } "${deleteConfirm?.title}"?`}
      />
    </div>
  );
}
