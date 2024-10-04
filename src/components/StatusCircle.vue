<template>
  <div class="status-circle" :style="{ backgroundColor: circleColor }"></div>
</template>

<script setup>
import { ref, computed } from "vue";
const props = defineProps({
  complete_till: Number,
});

const startDate = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
const endDate = Math.floor(new Date().setHours(23, 59, 59, 999) / 1000);
const circleColor = computed(() => {
  if (!props.complete_till || props.complete_till < startDate) {
    return "red"; // Если нет задачи или она просрочена
  } else if (props.complete_till > endDate) {
    return "yellow"; // Если задача на сегодня
  } else {
    return "green"; // Если задача больше чем через день
  }
});
</script>

<style scoped>
.status-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
}
</style>
