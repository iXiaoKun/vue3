<!-- src/components/GiftModal.vue -->
 <!-- 这个组件负责显示礼物弹窗 -->
<template>
    <div v-if="show" class="gift-modal">
      <div class="gift-modal-content">
        <span class="close" @click="close">&times;</span>
        <h2>恭喜你获得以下礼物！</h2>
        <ul class="gift-list">
          <li v-for="gift in gifts" :key="gift">{{ gift }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    show: boolean;
    gifts: string[];
  }>();
  
  const emit = defineEmits(['close']);
  
  const close = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .gift-modal {
    display: block;
    position: fixed;
    z-index: 2;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .gift-modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 400px;
    border-radius: 8px;
    text-align: center;
  }
  
  .gift-modal-content h2 {
    color: #ff4081;
    margin-bottom: 15px;
  }
  
  .gift-list {
    list-style-type: none;
    padding: 0;
  }
  
  .gift-list li {
    margin: 10px 0;
    font-size: 16px;
    color: #333;
  }
  
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  </style>