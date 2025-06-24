'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { Task, Category, TaskStatus } from '@/types';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedStatus, setEditedStatus] = useState<TaskStatus>('pending');
  const [editedCategoryId, setEditedCategoryId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { updateTask, deleteTask, categories, tasks } = useTasks();
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      const foundTask = tasks.find((t) => t.id === resolvedParams.id);
      if (foundTask) {
        setTask(foundTask);
        setEditedTitle(foundTask.title);
        setEditedStatus(foundTask.status);
        setEditedCategoryId(foundTask.categoryId);
      } else {
        router.push('/');
      }
    }
  }, [resolvedParams, tasks, router]);

  const handleSave = () => {
    if (!task || !editedTitle.trim()) return;

    updateTask(task.id, {
      title: editedTitle.trim(),
      status: editedStatus,
      categoryId: editedCategoryId,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    if (task) {
      setEditedTitle(task.title);
      setEditedStatus(task.status);
      setEditedCategoryId(task.categoryId);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!task) return;

    setIsDeleting(true);
    deleteTask(task.id);
    router.push('/');
  };

  const getStatusConfig = (status: TaskStatus) => {
    const statusConfigs = {
      'pending': {
        label: 'Ожидает',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      'in-progress': {
        label: 'В процессе',
        className: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      },
      'completed': {
        label: 'Завершено',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      },
    };
    return statusConfigs[status];
  };

  const getCategoryById = (categoryId: string): Category => {
    return categories.find(cat => cat.id === categoryId) || {
      id: 'unknown',
      name: 'Неизвестная категория',
      color: '#6B7280'
    };
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка задачи...</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(task.status);
  const category = getCategoryById(task.categoryId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к списку задач
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="mb-8">
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название задачи
                    </label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      placeholder="Введите название задачи"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Категория
                    </label>
                    <select
                      value={editedCategoryId}
                      onChange={(e) => setEditedCategoryId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Статус
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(['pending', 'in-progress', 'completed'] as TaskStatus[]).map((status) => {
                        const config = getStatusConfig(status);
                        return (
                          <label
                            key={status}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              editedStatus === status
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="status"
                              value={status}
                              checked={editedStatus === status}
                              onChange={(e) => setEditedStatus(e.target.value as TaskStatus)}
                              className="sr-only"
                            />
                            <div className={config.className.includes('amber') ? 'text-amber-600' : config.className.includes('blue') ? 'text-blue-600' : 'text-emerald-600'}>
                              {config.icon}
                            </div>
                            <span className="font-medium">{config.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!editedTitle.trim()}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Сохранить
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight pr-4">
                      {task.title}
                    </h1>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Редактировать"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Удалить"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${statusConfig.className}`}>
                      {statusConfig.icon}
                      <span className="font-medium">{statusConfig.label}</span>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                      <div
                        className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-gray-700">{category.name}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-gray-600">
                      <span className="font-medium">Создано:</span> {formatDate(task.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Удалить задачу"
        message={`Вы уверены, что хотите удалить задачу "${task.title}"? Это действие нельзя отменить.`}
        confirmText={isDeleting ? 'Удаление...' : 'Удалить'}
      />
    </div>
  );
} 