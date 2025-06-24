import { Task, Category } from '@/types';
import { TaskCard } from './TaskCard';

interface ListViewProps {
  tasks: Task[];
  categories: Category[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const ListView = ({
  tasks,
  categories,
  onEditTask,
  onDeleteTask
}: ListViewProps) => {
  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || {
      id: 'unknown',
      name: 'Неизвестная категория',
      color: '#6B7280'
    };
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center py-16 sm:py-24">
          <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-6 text-gray-300">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
              />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Нет задач</h3>
          <p className="text-gray-500 max-w-md mx-auto text-base sm:text-lg">
            Создайте первую задачу, чтобы начать работу с проектами
          </p>
          <div className="mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Нажмите кнопку &quot;Создать задачу&quot; выше
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {tasks.map((task) => (
            <div key={task.id} className="relative">
              <TaskCard
                task={task}
                category={getCategoryById(task.categoryId)}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 