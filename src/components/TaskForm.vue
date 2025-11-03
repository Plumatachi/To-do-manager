<script setup lang="ts">
import {ref, inject} from 'vue';
import { Status } from '../types/Status';

const emit = defineEmits<{
  addTask: [title: string, status: Status];
}>();

const sounds = inject<any>('sounds');

const title = ref('');
const status = ref<Status>(Status.TODO);
const errorMessage = ref('');

const validateForm = (): boolean => {
  if (!title.value.trim()) {
    errorMessage.value = 'Le titre est obligatoire';
    sounds?.playError();
    return false;
  }
  errorMessage.value = '';
  return true;
};

const handleSubmit = () => {
  if (validateForm()) {
    emit('addTask', title.value.trim(), status.value);
    title.value = '';
    status.value = Status.TODO;
  }
};
</script>

<template>
  <div class="task-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Titre :</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="Entrez le titre de la tâche"
          @input="errorMessage = ''"
        />
      </div>

      <div class="form-group">
        <label for="status">Statut :</label>
        <select id="status" v-model="status">
          <option value="to do">À faire</option>
          <option value="in progress">En cours</option>
          <option value="done">Terminé</option>
        </select>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <button type="submit" class="btn-submit">Ajouter</button>
    </form>
  </div>
</template>

<style scoped>
.task-form {
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

input:focus,
select:focus {
  outline: none;
  border-color: #4a90e2;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f8d7da;
  border-radius: 4px;
}

.btn-submit {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-submit:hover {
  background: #357abd;
}
</style>
