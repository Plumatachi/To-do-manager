<script setup lang="ts">
import { ref, computed } from 'vue';
import TaskItem from './TaskItem.vue';
import type { Task } from '../types/Task';
import { Status } from '../types/Status';
import { countTasksByStatus } from '../utils/taskHelpers';

interface Props {
  tasks: Task[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateStatus: [id: string | number, newStatus: Status];
  deleteTask: [id: string | number];
  updateTitle: [id: string | number, newTitle: string];
}>();

const filterStatus = ref<Status | 'all'>('all');

const filteredTasks = computed(() => {
  if (filterStatus.value === 'all') {
    return props.tasks;
  }
  return props.tasks.filter(task => task.status === filterStatus.value);
});

const taskCount = computed(() => {
  return {
    total: props.tasks.length,
    todo: countTasksByStatus(props.tasks, Status.TODO),
    inProgress: countTasksByStatus(props.tasks, Status.IN_PROGRESS),
    done: countTasksByStatus(props.tasks, Status.DONE)
  };
});

const handleUpdateStatus = (id: string | number, newStatus: Status) => {
  emit('updateStatus', id, newStatus);
};

const handleDeleteTask = (id: string | number) => {
  emit('deleteTask', id);
};

const handleUpdateTitle = (id: string | number, newTitle: string) => {
  emit('updateTitle', id, newTitle);
};
</script>

<template>
  <div class="task-list">
    <div class="task-list-header">
      <h2>Mes tâches ({{ taskCount.total }})</h2>

      <div class="task-stats">
        <span class="stat stat-todo">À faire: {{ taskCount.todo }}</span>
        <span class="stat stat-progress">En cours: {{ taskCount.inProgress }}</span>
        <span class="stat stat-done">Terminé: {{ taskCount.done }}</span>
      </div>

      <div class="filter-buttons">
        <button
          @click="filterStatus = 'all'"
          :class="{ active: filterStatus === 'all' }"
          class="filter-btn"
        >
          Toutes
        </button>
        <button
          @click="filterStatus = Status.TODO"
          :class="{ active: filterStatus === Status.TODO }"
          class="filter-btn"
        >
          À faire
        </button>
        <button
          @click="filterStatus = Status.IN_PROGRESS"
          :class="{ active: filterStatus === Status.IN_PROGRESS }"
          class="filter-btn"
        >
          En cours
        </button>
        <button
          @click="filterStatus = Status.DONE"
          :class="{ active: filterStatus === Status.DONE }"
          class="filter-btn"
        >
          Terminé
        </button>
      </div>
    </div>

    <div v-if="filteredTasks.length === 0" class="empty-state">
      <p v-if="props.tasks.length === 0">
        Aucune tâche pour le moment. Commencez par en ajouter une !
      </p>
      <p v-else>
        Aucune tâche avec ce filtre.
      </p>
    </div>

    <div v-else class="tasks-container">
      <TaskItem
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @update-status="handleUpdateStatus"
        @delete-task="handleDeleteTask"
        @update-title="handleUpdateTitle"
      />
    </div>
  </div>
</template>

<style scoped>
.task-list {
  margin-top: 2rem;
}

.task-list-header {
  margin-bottom: 1.5rem;
}

h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.task-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.stat {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-todo {
  background: #e9ecef;
  color: #6c757d;
}

.stat-progress {
  background: #fff3cd;
  color: #856404;
}

.stat-done {
  background: #d4edda;
  color: #155724;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #4a90e2;
  color: #4a90e2;
}

.filter-btn.active {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
  font-size: 1rem;
}

.empty-state p {
  margin: 0;
}

.tasks-container {
  display: flex;
  flex-direction: column;
}
</style>
