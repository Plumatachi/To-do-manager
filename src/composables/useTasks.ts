import { ref } from "vue";
import { onMounted } from "vue";
import type { Status } from "../types/Status";
import type { Task } from "../types/Task";

export function useTasks() {
  const tasks = ref<Task[]>([]);

  onMounted(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      tasks.value = JSON.parse(savedTasks);
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
      status
    };
    tasks.value.push(newTask);
    saveTasks();
  };

  const updateStatus = (id: string | number, newStatus: Status) => {
    const task = tasks.value.find(t => t.id === id);
    if (task) {
      task.status = newStatus;
      saveTasks();
    }
  };

  const deleteTask = (id: string | number) => {
    tasks.value = tasks.value.filter(t => t.id !== id);
    saveTasks();
  };

  const updateTitle = (id: string | number, newTitle: string) => {
    const task = tasks.value.find(t => t.id === id);
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
    }
}
