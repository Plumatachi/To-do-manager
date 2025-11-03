import { ref } from 'vue';

// Bibliothèque de sons libres de droits
const SOUND_THEMES = {
  default: {
    click: 'https://cdn.freesound.org/previews/536/536084_11861866-lq.mp3',
    success: '/sounds/default/success.wav',
    delete: '/sounds/default/delete.wav',
    statusChange: '/sounds/default/statusChange.wav',
    toggle: '/sounds/default/toggle.wav',
    error: '/sounds/default/error.wav',
    background: '/sounds/default/background.wav'
  },
  retro: {
    click: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3',
    success: '/sounds/retro/success.wav',
    delete: '/sounds/retro/delete.wav',
    statusChange: '/sounds/retro/statusChange.wav',
    toggle: '/sounds/retro/toggle.wav',
    error: '/sounds/retro/error.wav',
    background: '/sounds/retro/background.wav'
  },
  chill: {
    click: '/sounds/chill/click.wav',
    success: '/sounds/chill/success.wav',
    delete: '/sounds/chill/delete.wav',
    statusChange: '/sounds/chill/statusChange.mp3',
    toggle: '/sounds/chill/toggle.wav',
    error: '/sounds/chill/error.wav',
    background: '/sounds/chill/background.wav'
  }
};

export function useSounds() {
  const isMuted = ref(false);
  const currentTheme = ref<keyof typeof SOUND_THEMES>('default');
  const backgroundMusic = ref<HTMLAudioElement | null>(null);
  const volume = ref(0.5);

  // Cache des sons préchargés
  const soundCache = new Map<string, HTMLAudioElement>();

  // Précharger un son
  const preloadSound = (url: string) => {
    if (!soundCache.has(url)) {
      const audio = new Audio(url);
      audio.volume = volume.value;
      audio.preload = 'auto';
      soundCache.set(url, audio);
    }
    return soundCache.get(url)!;
  };

  // Précharger tous les sons d'un thème
  const preloadTheme = (theme: keyof typeof SOUND_THEMES) => {
    const sounds = SOUND_THEMES[theme];
    Object.values(sounds).forEach(url => {
      if (url) preloadSound(url);
    });
  };

  // Jouer un son (fonction interne)
  const playSound = (soundType: keyof Omit<typeof SOUND_THEMES.default, 'background'>) => {
    if (isMuted.value) return;

    const url = SOUND_THEMES[currentTheme.value][soundType];
    if (!url) return;

    const audio = preloadSound(url);
    audio.currentTime = 0;
    audio.volume = volume.value;
    audio.play().catch(err => console.warn('Erreur lecture son:', err));
  };

  // Fonctions publiques pour chaque son
  const playClick = () => playSound('click');
  const playSuccess = () => playSound('success');
  const playDelete = () => playSound('delete');
  const playStatusChange = () => playSound('statusChange');
  const playToggle = () => playSound('toggle');
  const playError = () => playSound('error');

  // Musique de fond
  const playBackgroundMusic = () => {
    if (isMuted.value || backgroundMusic.value) return;

    const url = SOUND_THEMES[currentTheme.value].background;
    if (!url) return;

    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = volume.value * 0.25;
    audio.play().catch(err => console.warn('Erreur lecture musique:', err));

    backgroundMusic.value = audio;
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusic.value) {
      backgroundMusic.value.pause();
      backgroundMusic.value.currentTime = 0;
      backgroundMusic.value = null;
    }
  };

  const toggleMute = () => {
    isMuted.value = !isMuted.value;
    if (isMuted.value) {
      stopBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
    playToggle();
  };

  // Changer de thème
  const setTheme = (theme: keyof typeof SOUND_THEMES) => {
    stopBackgroundMusic();
    currentTheme.value = theme;
    preloadTheme(theme);
    if (!isMuted.value) {
      playBackgroundMusic();
    }
  };

  // Ajuster le volume
  const setVolume = (newVolume: number) => {
    volume.value = Math.max(0, Math.min(1, newVolume));
    if (backgroundMusic.value) {
      backgroundMusic.value.volume = volume.value * 0.25;
    }
    // Mettre à jour le volume des sons en cache
    soundCache.forEach(audio => {
      audio.volume = volume.value;
    });
  };

  // Précharger le thème par défaut au montage
  preloadTheme(currentTheme.value);

  return {
    isMuted,
    currentTheme,
    volume,
    themes: Object.keys(SOUND_THEMES) as Array<keyof typeof SOUND_THEMES>,
    playClick,
    playSuccess,
    playDelete,
    playStatusChange,
    playToggle,
    playError,
    playBackgroundMusic,
    stopBackgroundMusic,
    toggleMute,
    setTheme,
    setVolume,
  };
}
