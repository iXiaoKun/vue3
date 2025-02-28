<template>
    <div class="image-switcher">
      <el-carousel :interval="4000" arrow="always">
        <el-carousel-item v-for="(image, index) in images" :key="index">
          <img :src="image" alt="背景图片" style="width: 100%; height: auto;" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  defineProps<{
    images: string[];
  }>();
  </script>
  
  <style scoped>
  .image-switcher {
    margin-top: 10px;
  }
  </style>