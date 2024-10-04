<template>
  <svg width="16" height="16">
    <circle cx="8" cy="8" r="8" :fill="statusColor" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  task: Object,
});

const statusColor = computed(() => {
  if (!props.task || new Date(props.task.date) < new Date()) {
    return 'red'; // задача просрочена или отсутствует
  } else if (new Date(props.task.date).toDateString() === new Date().toDateString()) {
    return 'green'; // задача на сегодня
  } else {
    return 'yellow'; // задача через несколько дней
  }
});
</script>