import { Task, Category } from '@/types';
import Link from 'next/link';

interface TaskCardProps {
  task: Task;
  category: Category;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

export const TaskCard = ({ task, category, onEdit, onDelete, isDragging }: TaskCardProps) => {
  const getStatusConfig = (status: string) => {
    const statusConfig = {
      'pending': { 
        label: 'Ожидает', 
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      'in-progress': { 
        label: 'В процессе', 
        className: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      },
      'completed': { 
        label: 'Завершено', 
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      },
    };
    
    return statusConfig[status as keyof typeof statusConfig];
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Сегодня';
    } else if (diffDays === 2) {
      return 'Вчера';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} дн. назад`;
    } else {
      return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      }).format(date);
    }
  };

  const statusConfig = getStatusConfig(task.status);

  return (
    <div className="relative group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="relative p-4 sm:p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-2">
            <Link 
              href={`/task/${task.id}`}
              className="block hover:text-blue-600 transition-colors duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-snug">
                {task.title}
              </h3>
            </Link>
            
            <div className="flex items-center gap-2 mt-3">
              <div
                className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm font-medium text-gray-600 truncate">{category.name}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="Редактировать"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Удалить"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${statusConfig.className}`}>
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </div>
          
          <time className="text-xs text-gray-500 font-medium">
            {formatDate(task.createdAt)}
          </time>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-50/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}; 