<script setup lang="ts">
import { inject } from 'vue';

const sounds = inject<any>('sounds');

const themeInfo = {
  default: {
    name: 'Défaut',
    icon: 'mdi-music-note',
    description: 'Sons épurés et professionnels',
    color: '#06e3a6'
  },
  retro: {
    name: 'Rétro',
    icon: 'mdi-gamepad-variant',
    description: 'Sons arcade vintage',
    color: '#ef4444'
  },
  chill: {
    name: 'Chill',
    icon: 'mdi-tea',
    description: 'Ambiance relaxante et douce',
    color: '#f3d1ab'
  }
};

const selectTheme = (theme: string) => {
  sounds.setTheme(theme);
  sounds.playSuccess();
};
</script>

<template>
  <div class="theme-selector">
    <div class="theme-header">
      <v-icon>mdi-palette</v-icon>
      <h3>Thème sonore</h3>
    </div>

    <div class="theme-grid">
      <button
        v-for="(info, theme) in themeInfo"
        :key="theme"
        class="theme-card"
        :class="{ active: sounds.currentTheme.value === theme }"
        :style="{ '--theme-color': info.color }"
        @click="selectTheme(theme)"
        @mouseenter="sounds.playHover()"
      >
        <div class="theme-icon">
          <v-icon>{{ info.icon }}</v-icon>
        </div>
        <div class="theme-info">
          <span class="theme-name">{{ info.name }}</span>
          <span class="theme-desc">{{ info.description }}</span>
        </div>
        <div v-if="sounds.currentTheme.value === theme" class="active-indicator">
          <v-icon>mdi-check-circle</v-icon>
        </div>
      </button>
    </div>

    <div class="volume-control">
      <v-icon>mdi-volume-high</v-icon>
      <input
        type="range"
        min="0"
        max="100"
        :value="sounds.volume.value * 100"
        @input="sounds.setVolume(Number(($event.target as HTMLInputElement).value) / 100)"
        class="volume-slider"
      />
      <span class="volume-value">{{ Math.round(sounds.volume.value * 100) }}%</span>
    </div>
  </div>
</template>

<style scoped>
.theme-selector {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  max-width: 400px;
}

.theme-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

.theme-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.theme-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.theme-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.theme-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--theme-color);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.theme-card:hover {
  background: #f1f3f5;
  transform: translateX(4px);
}

.theme-card:hover::before {
  opacity: 1;
}

.theme-card.active {
  background: linear-gradient(135deg, var(--theme-color)15, var(--theme-color)05);
  border-color: var(--theme-color);
}

.theme-card.active::before {
  opacity: 1;
}

.theme-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--theme-color);
  border-radius: 12px;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
}

.theme-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  text-align: left;
}

.theme-name {
  font-weight: 600;
  font-size: 1rem;
  color: #1a1a1a;
}

.theme-desc {
  font-size: 0.875rem;
  color: #6b7280;
}

.active-indicator {
  color: var(--theme-color);
  font-size: 24px;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.volume-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #06e3a6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  background: #147358;
  transform: scale(1.2);
}

.volume-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #06e3a6;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.volume-slider::-moz-range-thumb:hover {
  background: #147358;
  transform: scale(1.2);
}

.volume-value {
  font-weight: 600;
  color: #1a1a1a;
  min-width: 45px;
  text-align: right;
}

@media (max-width: 768px) {
  .theme-selector {
    max-width: 100%;
    padding: 1rem;
  }

  .theme-card {
    padding: 0.875rem;
  }

  .theme-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .theme-name {
    font-size: 0.9rem;
  }

  .theme-desc {
    font-size: 0.8rem;
  }
}
</style>
