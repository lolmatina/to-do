import { useState } from 'react';
import { Task, Category } from '@/types';
import { TaskCard } from './TaskCard';

interface KanbanViewProps {
  tasks: Task[];
  categories: Category[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newCategoryId: string) => void;
}

export const KanbanView = ({
  tasks,
  categories,
  onEditTask,
  onDeleteTask,
  onMoveTask
}: KanbanViewProps) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', task.id);
    
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(1deg)';
    dragImage.style.opacity = '0.9';
    dragImage.style.pointerEvents = 'none';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.left = '-1000px';
    dragImage.style.width = Math.min(e.currentTarget.getBoundingClientRect().width, 300) + 'px';
    dragImage.style.zIndex = '9999';
    document.body.appendChild(dragImage);
    
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 100);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverCategory(null);
  };

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategory(categoryId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverCategory(null);
    }
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    setDragOverCategory(null);
    
    if (draggedTask && draggedTask.categoryId !== categoryId) {
      onMoveTask(draggedTask.id, categoryId);
    }
    setDraggedTask(null);
  };

  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter(task => task.categoryId === categoryId);
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-16 sm:py-24">
        <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-6 text-gray-300">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Нет категорий</h3>
        <p className="text-gray-500 max-w-md mx-auto text-base sm:text-lg">
          Создайте категории для организации задач в канбан-доске
        </p>
        <div className="mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Нажмите кнопку &quot;Создать категорию&quot; выше
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kanban-container">
      <div className="block lg:hidden space-y-6">
        {categories.map((category) => {
          const categoryTasks = getTasksByCategory(category.id);
          const isDropTarget = dragOverCategory === category.id;
          
          return (
            <div
              key={category.id}
              className={`relative bg-gray-50 rounded-2xl p-4 transition-all duration-200 border-2 ${
                isDropTarget 
                  ? 'bg-blue-50 border-blue-300 shadow-lg' 
                  : 'border-gray-200'
              }`}
              onDragOver={(e) => handleDragOver(e, category.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, category.id)}
            >
              {isDropTarget && (
                <div className="absolute inset-0 bg-blue-100/30 rounded-2xl border-2 border-dashed border-blue-400 flex items-center justify-center z-10 pointer-events-none">
                  <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-blue-300">
                    <p className="text-blue-700 font-medium text-sm">Отпустите для перемещения</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-white text-gray-600 text-xs px-2.5 py-1 rounded-lg font-medium shadow-sm">
                    {categoryTasks.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3 min-h-[120px]">
                {categoryTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    Нет задач
                  </div>
                ) : (
                  categoryTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      className="cursor-move touch-manipulation transition-all duration-200"
                    >
                      <TaskCard
                        task={task}
                        category={category}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                        isDragging={draggedTask?.id === task.id}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden lg:block">
        <div className="flex gap-6 overflow-x-auto pb-4 kanban-columns">
          {categories.map((category) => {
            const categoryTasks = getTasksByCategory(category.id);
            const isDropTarget = dragOverCategory === category.id;
            
            return (
              <div
                key={category.id}
                className={`relative flex-shrink-0 w-80 bg-gray-50 rounded-2xl p-5 transition-all duration-200 border-2 ${
                  isDropTarget 
                    ? 'bg-blue-50 border-blue-300 shadow-lg' 
                    : 'border-gray-200'
                }`}
                onDragOver={(e) => handleDragOver(e, category.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, category.id)}
              >
                {isDropTarget && (
                  <div className="absolute inset-0 bg-blue-100/30 rounded-2xl border-2 border-dashed border-blue-400 flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-blue-300">
                      <p className="text-blue-700 font-medium text-sm">Отпустите для перемещения</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                  </div>
                  <span className="bg-white text-gray-600 text-xs px-2.5 py-1 rounded-lg font-medium shadow-sm">
                    {categoryTasks.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto custom-scrollbar">
                  {categoryTasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-sm">Нет задач в этой категории</p>
                      <p className="text-xs mt-1 opacity-75">Перетащите задачи сюда</p>
                    </div>
                  ) : (
                    categoryTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className="cursor-move transition-all duration-200"
                      >
                        <TaskCard
                          task={task}
                          category={category}
                          onEdit={onEditTask}
                          onDelete={onDeleteTask}
                          isDragging={draggedTask?.id === task.id}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 