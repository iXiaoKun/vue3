<!-- src/components/PeopleListModal.vue -->
<template>
    <div v-if="show" class="modal">
      <div class="modal-content">
        <span class="close" @click="close">&times;</span>
        <h2 class="modal-title">人员列表</h2>
        <ul class="people-list">
          <li v-for="person in people" :key="person.name">
            <span class="person-name">{{ person.name }}</span> - 
            <span class="person-birthday">{{ person.birthday }}</span> 
            <span class="person-calendar-type">{{ person.isLunar ? '(农历)' : '(公历)' }}</span> - 
            <span class="person-age">{{ getAge(person) }} 岁</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { getAge } from '../utils/birthdayUtils';
  
  defineProps<{
    show: boolean;
    people: {
      name: string;
      birthday: string;
      isLunar: boolean;
    }[];
  }>();
  
  const emit = defineEmits(['close']);
  
  const close = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 400px;
    border-radius: 8px;
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
  
  .modal-title {
    text-align: center;
    color: #333;
    margin-bottom: 15px;
  }
  
  .people-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.3s ease;
  }
  
  .people-list li:hover {
    background-color: #f9f9f9;
  }
  
  .person-name {
    font-weight: bold;
    color: #007bff;
  }
  
  .person-birthday {
    color: #666;
  }
  
  .person-calendar-type {
    color: #999;
  }
  
  .person-age {
    color: #009688;
  }
  </style>