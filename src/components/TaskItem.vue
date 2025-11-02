<script setup lang="ts">
import {ref} from 'vue';
import type {Task} from '../types/Task';
import { Status } from '../types/Status';

interface Props {
  task: Task;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateStatus: [id: string | number, newStatus: Status];
  deleteTask: [id: string | number];
  updateTitle: [id: string | number, newTitle: string];
}>();

const isEditing = ref(false);
const editedTitle = ref(props.task.title);

const getNextStatus = (currentStatus: Status): Status => {
  const statusOrder: Status[] = [Status.TODO, Status.IN_PROGRESS, Status.DONE];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const nextIndex = (currentIndex + 1) % statusOrder.length;
  return statusOrder[nextIndex];
};

const handleStatusChange = () => {
  const newStatus = getNextStatus(props.task.status);
  emit('updateStatus', props.task.id, newStatus);
};

const handleDelete = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    emit('deleteTask', props.task.id);
  }
};

const startEdit = () => {
  isEditing.value = true;
  editedTitle.value = props.task.title;
};

const saveEdit = () => {
  if (editedTitle.value.trim()) {
    emit('updateTitle', props.task.id, editedTitle.value.trim());
    isEditing.value = false;
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  editedTitle.value = props.task.title;
};

const getStatusLabel = (status: Status): string => {
  const labels: Record<Status, string> = {
    'to do': 'À faire',
    'in progress': 'En cours',
    'done': 'Terminé'
  };
  return labels[status];
};
</script>

<template>
  <div class="task-item" :class="`status-${task.status.replace(' ', '-')}`">
    <div class="task-content">
      <div v-if="!isEditing" class="task-title">
        {{ task.title }}
      </div>
      <div v-else class="task-edit">
        <input
          v-model="editedTitle"
          type="text"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
        />
        <button @click="saveEdit" class="btn-save">✓</button>
        <button @click="cancelEdit" class="btn-cancel">✕</button>
      </div>

      <span class="task-status">{{ getStatusLabel(task.status) }}</span>
    </div>

    <div class="task-actions">
      <button
        v-if="!isEditing"
        @click="startEdit"
        class="btn-action btn-edit"
        title="Éditer"
      >
        <VIcon>mdi-pencil</VIcon>
      </button>
      <button
        @click="handleStatusChange"
        class="btn-action btn-status"
        title="Changer le statut"
      >
        <VIcon>mdi-update</VIcon>
      </button>
      <button
        @click="handleDelete"
        class="btn-action btn-delete"
        title="Supprimer"
      >
        <VIcon>mdi-delete</VIcon>
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 6px;
  border-left: 4px solid;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.task-item:hover {
  transform: translateX(4px);
}

.status-to-do {
  border-left-color: #6c757d;
}

.status-in-progress {
  border-left-color: #ffc107;
}

.status-done {
  border-left-color: #28a745;
}

.task-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.task-title {
  font-size: 1rem;
  color: #333;
  flex: 1;
}

.status-done .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-edit {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.task-edit input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-save,
.btn-cancel {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-save {
  background: #28a745;
  color: white;
}

.btn-cancel {
  background: #dc3545;
  color: white;
}

.task-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: #e9ecef;
  color: #495057;
}

.status-to-do .task-status {
  background: #e9ecef;
  color: #6c757d;
}

.status-in-progress .task-status {
  background: #fff3cd;
  color: #856404;
}

.status-done .task-status {
  background: #d4edda;
  color: #155724;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-action:hover {
  background: #f8f9fa;
}

.btn-delete:hover {
  background: #f8d7da;
}
</style>
