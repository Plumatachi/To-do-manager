<script setup lang="ts">
import { ref, inject } from 'vue';
import type { Task } from '../types/Task';
import { Status } from '../types/Status';
import { getStatusLabel, getStatusIcon, getNextStatus } from '../utils/taskHelpers';

defineOptions({
  name: 'TaskItem',
})

interface Props {
  task: Task;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateStatus: [id: string, newStatus: Status];
  deleteTask: [id: string];
  updateTitle: [id: string, newTitle: string];
  addSubTask: [parentId: string, title: string];
}>();

const sounds = inject<any>('sounds');

const isEditing = ref(false);
const editedTitle = ref(props.task.title);
const showMenu = ref(false);
const showSubTaskForm = ref(false);
const newSubTaskTitle = ref('');
const showSubtasks = ref(true);

const handleAddSubTask = () => {
  showSubTaskForm.value = true;
  showMenu.value = false;
  sounds?.playClick();
};

const handleSubmitSubTask = () => {
  if (newSubTaskTitle.value.trim()) {
    emit('addSubTask', props.task.id, newSubTaskTitle.value.trim());
    newSubTaskTitle.value = '';
    showSubTaskForm.value = false;
    sounds?.playSuccess();
  } else {
    sounds?.playError();
  }
};

const handleUpdateSubTaskStatus = (id: string, newStatus: Status) => {
  emit('updateStatus', id, newStatus);
};

const handleUpdateSubTaskTitle = (id: string, newTitle: string) => {
  emit('updateTitle', id, newTitle);
};

const handleDeleteSubTask = (id: string) => {
  emit('deleteTask', id);
};

const handleStatusChange = () => {
  const newStatus = getNextStatus(props.task.status);
  emit('updateStatus', props.task.id, newStatus);
  showMenu.value = false;
  sounds?.playStatusChange();
};

const handleDelete = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    emit('deleteTask', props.task.id);
    sounds?.playDelete();
  }
  showMenu.value = false;
};

const startEdit = () => {
  isEditing.value = true;
  editedTitle.value = props.task.title;
  showMenu.value = false;
  sounds?.playEdit();
};

const saveEdit = () => {
  if (editedTitle.value.trim()) {
    emit('updateTitle', props.task.id, editedTitle.value.trim());
    isEditing.value = false;
    sounds?.playSuccess();
  } else {
    sounds?.playError();
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  editedTitle.value = props.task.title;
  sounds?.playClick();
};

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
  sounds?.playClick();
};

const closeMenu = () => {
  showMenu.value = false;
};

const toggleSubtasks = () => {
  if (props.task.subtasks && props.task.subtasks.length > 0) {
    showSubtasks.value = !showSubtasks.value;
    sounds?.playToggle();
  }
};
</script>

<template>
  <div class="task-item-wrapper">
    <div
      class="task-item"
      :class="`status-${task.status.replace(' ', '-')}`"
      @click.self="closeMenu"
    >
      <div
        class="task-content"
        :class="{ 'has-subtasks': task.subtasks?.length > 0, 'clickable': task.subtasks?.length > 0 }"
        @click="toggleSubtasks"
      >
      <v-icon
        v-if="task.subtasks?.length > 0"
        class="expand-icon"
        :class="{ 'expanded': showSubtasks }"
      >
        mdi-chevron-right
      </v-icon>
      <v-icon class="status-icon">{{ getStatusIcon(task.status) }}</v-icon>

      <div v-if="!isEditing" class="task-title">
        {{ task.title }}
      </div>
      <div v-else class="task-edit" @click.stop>
        <input
          v-model="editedTitle"
          type="text"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          autofocus
        />
        <button @click="saveEdit" class="btn-save">
          <v-icon>mdi-check</v-icon>
        </button>
        <button @click="cancelEdit" class="btn-cancel">
          <v-icon>mdi-close</v-icon>
        </button>
      </div>

      <span class="task-status" @click.stop>{{ getStatusLabel(task.status) }}</span>
    </div>

    <div v-if="showSubTaskForm" class="modal-overlay" @click="showSubTaskForm = false">
      <div class="modal-content" @click.stop>
        <h3>Ajouter une sous-tâche</h3>
        <input
          v-model="newSubTaskTitle"
          type="text"
          placeholder="Titre de la sous-tâche"
          @keyup.enter="handleSubmitSubTask"
          autofocus
        />
        <div class="modal-actions">
          <button @click="handleSubmitSubTask" class="btn-confirm">
            <v-icon>mdi-check</v-icon>
            <span>Ajouter</span>
          </button>
          <button @click="showSubTaskForm = false" class="btn-cancel">
            <v-icon>mdi-close</v-icon>
            <span>Annuler</span>
          </button>
        </div>
      </div>
    </div>

    <div class="task-actions" v-if="!isEditing" @click.stop>
      <button class="btn-menu" @click="toggleMenu">
        <v-icon>mdi-dots-vertical</v-icon>
      </button>

      <transition name="menu-fade">
        <div v-if="showMenu" class="dropdown-menu" @click.stop>
          <button @click="startEdit" class="menu-item">
            <v-icon>mdi-pencil-outline</v-icon>
            <span>Modifier</span>
          </button>
          <button @click="handleAddSubTask" class="menu-item">
            <v-icon>mdi-plus</v-icon>
            <span>Ajouter une sous-tâche</span>
          </button>
          <button @click="handleStatusChange" class="menu-item">
            <v-icon>mdi-update</v-icon>
            <span>Changer statut</span>
          </button>
          <button @click="handleDelete" class="menu-item danger">
            <v-icon>mdi-delete-outline</v-icon>
            <span>Supprimer</span>
          </button>
        </div>
      </transition>
    </div>

      <div v-if="showMenu" class="menu-overlay" @click="closeMenu"></div>
    </div>

    <transition name="menu-fade">
      <div v-if="task.subtasks?.length > 0 && showSubtasks" class="subtasks">
        <TaskItem
          v-for="subTask in task.subtasks"
          :key="subTask.id"
          :task="subTask"
          @update-status="handleUpdateSubTaskStatus"
          @delete-task="handleDeleteSubTask"
          @update-title="handleUpdateSubTaskTitle"
          @add-sub-task="(parentId, title) => $emit('addSubTask', parentId, title)"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.task-item-wrapper {
  margin-bottom: 0.75rem;
}

.task-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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

.task-content.clickable {
  cursor: pointer;
  user-select: none;
}

.task-content.clickable:hover {
  opacity: 0.9;
}

.expand-icon {
  font-size: 1.5rem;
  color: #666;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(90deg);
}

.status-icon {
  font-size: 1.5rem;
  color: #666;
}

.status-to-do .status-icon {
  color: #6c757d;
}

.status-in-progress .status-icon {
  color: #ffc107;
}

.status-done .status-icon {
  color: #28a745;
}

.task-title {
  font-size: 1rem;
  color: #333;
  flex: 1;
  word-break: break-word;
}

.status-done .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-edit {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  align-items: center;
}

.task-edit input {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #06e3a6;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-save,
.btn-cancel {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-save {
  background: #28a745;
  color: white;
}

.btn-save:hover {
  background: #218838;
}

.btn-cancel {
  background: #dc3545;
  color: white;
}

.btn-cancel:hover {
  background: #c82333;
}

.task-status {
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 600;
  background: #e9ecef;
  color: #495057;
  white-space: nowrap;
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
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
}

.btn-menu {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;
}

.btn-menu:hover {
  background: #f5f5f5;
  color: #06e3a6;
}

.btn-menu:active {
  background: #e9ecef;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 180px;
  overflow: hidden;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  transition: background 0.2s;
  text-align: left;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-item.danger {
  color: #dc3545;
}

.menu-item.danger:hover {
  background: #f8d7da;
}

.menu-item span {
  flex: 1;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background: transparent;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.2s ease;
}

.menu-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@media (max-width: 768px) {
  .task-item {
    padding: 0.875rem;
  }

  .task-content {
    gap: 0.75rem;
  }

  .task-status {
    display: none;
  }

  .status-icon {
    font-size: 1.25rem;
  }

  .dropdown-menu {
    min-width: 160px;
    right: -10px;
  }

  .menu-item {
    padding: 0.875rem;
  }
}

@media (max-width: 480px) {
  .task-title {
    font-size: 0.9rem;
  }

  .task-edit input {
    font-size: 0.9rem;
    padding: 0.4rem;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.modal-content input {
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-confirm {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-confirm:hover {
  background: #218838;
}

.btn-cancel {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cancel:hover {
  background: #c82333;
}

.subtasks {
  margin-top: 0.5rem;
  margin-left: 2rem;
  padding-left: 1rem;
  border-left: 3px solid #e9ecef;
  position: relative;
}

.subtasks::before {
  content: '';
  position: absolute;
  left: -3px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #06e3a6 0%, #e9ecef 100%);
}

.subtasks .task-item-wrapper:last-child {
  margin-bottom: 0;
}
</style>
