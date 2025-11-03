<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide } from 'vue';
import { useTasks } from './composables/useTasks';
import { useSounds } from './composables/useSounds';
import TaskForm from './components/TaskForm.vue';
import TaskList from './components/TaskList.vue';
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import SoundThemeSelector from '@/components/SoundThemeSelector.vue'
import type { Status } from './types/Status.ts';

const { tasks, addTask, updateStatus, deleteTask, updateTitle, addSubTask } = useTasks();
const sounds = useSounds();
const formVisible = ref(false);
const themeSelectorVisible = ref(false);

// Fournir les sons à tous les composants enfants
provide('sounds', sounds);

onMounted(() => {
  // Démarrer la musique de fond après un court délai
  setTimeout(() => {
    sounds.playBackgroundMusic();
  }, 500);
});

onUnmounted(() => {
  sounds.stopBackgroundMusic();
});

const toggleForm = () => {
  formVisible.value = !formVisible.value;
  sounds.playToggle();
}

const handleAddTask = (title: string, status: Status) => {
  addTask(title, status);
  sounds.playSuccess();
  if (window.innerWidth <= 768) {
    formVisible.value = false;
  }
};

const handleAddSubTask = (parentId: string, title: string) => {
  addSubTask(parentId, title);
  sounds.playSuccess();
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
        @add-sub-task="handleAddSubTask"
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

  <transition name="fade">
    <div v-if="themeSelectorVisible" class="theme-overlay" @click="themeSelectorVisible = false">
      <div class="theme-popup" @click.stop>
        <button class="close-btn" @click="themeSelectorVisible = false">
          <v-icon>mdi-close</v-icon>
        </button>
        <SoundThemeSelector />
      </div>
    </div>
  </transition>

  <button
    class="theme-button"
    @click="themeSelectorVisible = !themeSelectorVisible"
    title="Changer le thème sonore"
  >
    <v-icon>mdi-palette</v-icon>
  </button>

  <!-- Bouton de mute flottant -->
  <button
    class="mute-button"
    @click="sounds.toggleMute()"
    :title="sounds.isMuted.value ? 'Activer les sons' : 'Désactiver les sons'"
  >
    <v-icon>{{ sounds.isMuted.value ? 'mdi-volume-off' : 'mdi-volume-high' }}</v-icon>
  </button>

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

  .theme-button {
    bottom: 1rem;
    right: 4rem;
    width: 48px;
    height: 48px;
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

.mute-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #06e3a6;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(6, 227, 166, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1001;
}

.mute-button:hover {
  background: #147358;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(6, 227, 166, 0.6);
}

.mute-button:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .mute-button {
    bottom: 1rem;
    right: 1rem;
    width: 48px;
    height: 48px;
  }
}

.theme-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.theme-popup {
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  transition: all 0.2s ease;
  z-index: 1;
}

.close-btn:hover {
  background: #dc2626;
  transform: rotate(90deg) scale(1.1);
}

.theme-button {
  position: fixed;
  bottom: 2rem;
  right: 5rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #7c3aed;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1001;
}

.theme-button:hover {
  background: #6d28d9;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.6);
}

.theme-button:active {
  transform: scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
