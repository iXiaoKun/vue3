<!-- src/components/CountdownTimer.vue -->
 <!-- 这个组件负责显示下一个生日的倒计时 -->
<template>
    <div>
      <h2 class="special-heading">🎂 {{ person.name }} 的生日倒计时</h2>
      <div class="countdown">
        <span>{{ countdown.days }} 天</span>
        <span>{{ countdown.hours }} 小时</span>
        <span>{{ countdown.minutes }} 分钟</span>
        <span>{{ countdown.seconds }} 秒</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const props = defineProps<{
    person: {
      name: string;
      nextBirthday: Date;
    };
  }>();
  
  const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const updateCountdown = () => {
    const now = new Date();
    const diff = props.person.nextBirthday.getTime() - now.getTime();
    if (diff > 0) {
      countdown.value.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      countdown.value.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      countdown.value.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      countdown.value.seconds = Math.floor((diff % (1000 * 60)) / 1000);
    }
  };
  
  let timer: number;
  onMounted(() => {
    timer = setInterval(updateCountdown, 1000);
  });
  
  onUnmounted(() => {
    clearInterval(timer);
  });
  </script>
  
  <style scoped>
  .special-heading {
    font-size: 30px;
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
  
  .countdown {
    display: flex;
    gap: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-top: 20px;
  }
  
  .countdown span {
    background-color: #e9ecef;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>