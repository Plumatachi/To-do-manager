<script setup lang="ts">
interface Props {
  menuOpen?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  toggleMenu: [];
}>();

const handleToggle = () => {
  emit('toggleMenu');
};
</script>

<template>
  <header>
    <h1>To Do Manager</h1>
    <button class="menu-btn" @click="handleToggle" :class="{ 'active': menuOpen }">
      <v-icon v-if="!menuOpen">mdi-menu</v-icon>
      <v-icon v-else>mdi-close</v-icon>
    </button>
  </header>
</template>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #44bd97;
  padding: 1rem;
}

h1 {
  margin: 0;
  background: none;
  padding: 0;
}

.menu-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: white;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.menu-btn.active {
  background: rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .menu-btn {
    width: 44px;
    height: 44px;
  }
}
</style>
