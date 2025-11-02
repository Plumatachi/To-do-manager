<script setup lang="ts">
import { ref } from 'vue';
import { useTasks } from './composables/useTasks';
import TaskForm from './components/TaskForm.vue';
import TaskList from './components/TaskList.vue';
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

const { tasks, addTask, updateStatus, deleteTask, updateTitle } = useTasks();
const formVisible = ref(false);

const toggleForm = () => {
  formVisible.value = !formVisible.value;
}
</script>

<template>
  <Header></Header>

  <div class="container">
    <TaskList
      :tasks="tasks"
      @update-status="updateStatus"
      @delete-task="deleteTask"
      @update-title="updateTitle"
    />

    <div class="sidebar-container">
      <button
        class="btn-toggle"
        @click="toggleForm"
        :class="{ 'is-open': formVisible }"
      >
        <v-icon>{{ formVisible ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
      </button>

      <transition name="slide-fade">
        <div v-if="formVisible" class="sidebar">
          <TaskForm @add-task="addTask" />
        </div>
      </transition>
    </div>
  </div>

  <Footer></Footer>
</template>

<style scoped>
.container {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  transition: margin-right 0.3s ease;
}

.sidebar-container {
  position: fixed;
  right: 0;
  top: 80px;
  height: calc(100vh - 160px);
  z-index: 100;
}

.btn-toggle {
  position: absolute;
  left: -48px;
  top: 20px;
  width: 48px;
  height: 48px;
  background: #06e3a6;
  border: none;
  border-radius: 24px 0 0 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  color: white;
}

.btn-toggle:hover {
  background: #147358;
  transform: translateX(-4px);
}

.btn-toggle.is-open {
  left: -48px;
}

.sidebar {
  width: 400px;
  height: 100%;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  padding: 2rem;
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
    width: 320px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100vw;
  }

  .btn-toggle {
    left: -40px;
    width: 40px;
    height: 40px;
  }
}
</style>
