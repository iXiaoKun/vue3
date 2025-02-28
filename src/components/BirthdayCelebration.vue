<!-- src/components/BirthdayCelebration.vue -->
 <!-- 这个组件负责生日庆祝的逻辑，包括烟花效果、音乐播放等。 -->
<template>
    <div>
      <div class="fireworks-container"></div>
      <h1>{{ person?.name }}</h1>
      <h1>🎉生日快乐!!!🎂</h1>
      <button v-if="isMusicLoaded" class="gift-button" @click="openGift">
        拆礼包 🎁
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Fireworks from 'fireworks-js';
  import confetti from 'canvas-confetti';
  
  const props = defineProps<{
    person: {
      name: string;
      birthday: string;
      isLunar: boolean;
    };
    isMusicLoaded: boolean;
  }>();
  
  const emit = defineEmits(['openGift']);
  
  const openGift = () => {
    emit('openGift');
    confetti({
      particleCount: 300,
      spread: 50,
      origin: { y: 0.8 }
    });
  };
  
  onMounted(() => {
    const container = document.querySelector('.fireworks-container');
    if (container) {
      const fireworks = new Fireworks(container, {
        hue: { min: 0, max: 360 },
        acceleration: 1.05,
        particles: 30,
        traceLength: 1,
      });
      fireworks.start();
      setTimeout(() => {
        fireworks.stop();
      }, 10000);
    }
  });
  </script>
  
  <style scoped>
  .fireworks-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }
  
  .gift-button {
    display: block;
    margin: 20px auto 0;
    padding: 12px 24px;
    background-color: #ff4081;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .gift-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(255, 64, 129, 0.3);
  }
  
  .gift-button:active {
    transform: scale(0.95);
  }

h1 {
    font-size: 50px;
    color: #ff69b4;
    text-shadow: 
      3px 3px 0px #000,
      6px 6px 0px rgba(0, 0, 0, 0.2);
    transform: skewX(-10deg);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
  }
  </style>