<script setup lang="ts">
import { ref } from 'vue';
import { useTasks } from './composables/useTasks';
import TaskForm from './components/TaskForm.vue';
import TaskList from './components/TaskList.vue';
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import type { Status } from './types/Status.ts';

const { tasks, addTask, updateStatus, deleteTask, updateTitle } = useTasks();
const formVisible = ref(false);

const toggleForm = () => {
  formVisible.value = !formVisible.value;
}

const handleAddTask = (title: string, status: Status) => {
  addTask(title, status);
  if (window.innerWidth <= 768) {
    formVisible.value = false;
  }
};
</script>

<template>
  <Header @toggle-menu="toggleForm" :menu-open="formVisible"></Header>

  <div class="main-container" :class="{ 'form-open': formVisible }">
    <div class="container">
      <TaskList
        :tasks="tasks"
        @update-status="updateStatus"
        @delete-task="deleteTask"
        @update-title="updateTitle"
      />
    </div>

    <transition name="slide-fade">
      <div v-if="formVisible" class="sidebar">
        <div class="sidebar-header">
          <h2>Ajouter une tâche</h2>
        </div>
        <TaskForm @add-task="handleAddTask" />
      </div>
    </transition>
  </div>

  <Footer></Footer>
</template>

<style scoped>
.main-container {
  display: flex;
  position: relative;
  min-height: calc(100vh - 200px);
}

.container {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  transition: all 0.3s ease;
}

.sidebar {
  position: fixed;
  right: 0;
  top: 6.8rem;
  width: 400px;
  height: calc(100vh - 160px);
  background: white;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow-y: auto;
  padding: 2rem;
  z-index: 1000;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.sidebar-header h2 {
  margin: 0;
}

.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #06e3a6;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #147358;
}

@media (max-width: 1200px) {
  .sidebar {
    width: 350px;
  }

  .container {
    max-width: 700px;
    padding: 1.5rem;
  }
}

@media (max-width: 992px) {
  .sidebar {
    width: 320px;
  }

  .container {
    max-width: 600px;
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .main-container.form-open .container {
    display: none;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    padding: 2rem;
    z-index: 999;
  }

  .container {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .sidebar {
    padding: 0.75rem;
    padding-top: 70px;
  }

  .sidebar-header {
    margin-bottom: 1rem;
  }

  .container {
    padding: 0.75rem;
  }
}
</style>
