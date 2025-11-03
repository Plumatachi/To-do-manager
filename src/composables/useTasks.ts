import { ref } from "vue";
import { onMounted } from "vue";
import { Status } from "../types/Status";
import type { Task } from "../types/Task";

export function useTasks() {
  const tasks = ref<Task[]>([]);

  const migrateTask = (task: Task): Task => {
    return {
      ...task,
      subtasks: task.subtasks || []
    };
  };

  const migrateTasks = (tasks: Task[]): Task[] => {
    return tasks.map(task => {
      const migratedTask = migrateTask(task);
      if (migratedTask.subtasks.length > 0) {
        migratedTask.subtasks = migrateTasks(migratedTask.subtasks);
      }
      return migratedTask;
    });
  };

  onMounted(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      tasks.value = migrateTasks(parsedTasks);
      saveTasks(); // Save migrated data
    }
  });

  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
  };

  const generateId = (): string => {
    return crypto.randomUUID();
  };

  const addTask = (title: string, status: Status) => {
    const newTask: Task = {
      id: generateId(),
      title,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: []
    };
    tasks.value.push(newTask);
    saveTasks();
  };

  const findTaskRecursive = (tasks: Task[], id: string): Task | null => {
    for (const task of tasks) {
      if (task.id === id) return task;
      if (task.subtasks && task.subtasks.length > 0) {
        const found = findTaskRecursive(task.subtasks, id);
        if (found) return found;
      }
    }
    return null;
  };

  const deleteTaskRecursive = (tasks: Task[], id: string): boolean => {
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      if (!task) continue;
      
      if (task.id === id) {
        tasks.splice(i, 1);
        return true;
      }
      if (task.subtasks && task.subtasks.length > 0) {
        if (deleteTaskRecursive(task.subtasks, id)) {
          return true;
        }
      }
    }
    return false;
  };

  const addSubTask = (taskId: string, title: string) => {
    const task = findTaskRecursive(tasks.value, taskId);
    if (task) {
      if (!task.subtasks) {
        task.subtasks = [];
      }
      task.subtasks.push({
        id: generateId(),
        title,
        status: Status.TODO,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: []
      });
      saveTasks();
    }
  };

  const updateStatus = (id: string, newStatus: Status) => {
    const task = findTaskRecursive(tasks.value, id);
    if (task) {
      task.status = newStatus;
      saveTasks();
    }
  };

  const deleteTask = (id: string) => {
    deleteTaskRecursive(tasks.value, id);
    saveTasks();
  };

  const updateTitle = (id: string, newTitle: string) => {
    const task = findTaskRecursive(tasks.value, id);
    if (task) {
      task.title = newTitle;
      saveTasks();
    }
  };

  return {
    tasks,
    addTask,
    updateStatus,
    deleteTask,
    updateTitle,
    addSubTask,
  }
}
