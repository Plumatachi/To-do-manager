import { Status } from '../types/Status';

export const getStatusLabel = (status: Status): string => {
  const labels: Record<Status, string> = {
    [Status.TODO]: 'À faire',
    [Status.IN_PROGRESS]: 'En cours',
    [Status.DONE]: 'Terminé'
  };
  return labels[status];
};

export const getStatusIcon = (status: Status): string => {
  const icons: Record<Status, string> = {
    [Status.TODO]: 'mdi-clock-outline',
    [Status.IN_PROGRESS]: 'mdi-progress-clock',
    [Status.DONE]: 'mdi-check-circle'
  };
  return icons[status];
};

export const getNextStatus = (currentStatus: Status): Status => {
  const statusOrder: Status[] = [Status.TODO, Status.IN_PROGRESS, Status.DONE];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const nextIndex = (currentIndex + 1) % statusOrder.length;
  return statusOrder[nextIndex] as Status;
};

export const countTasksByStatus = (tasks: any[], status: Status): number => {
  return tasks.filter(t => t.status === status).length;
};
