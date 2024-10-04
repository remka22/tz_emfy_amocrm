<script setup>
import { ref, computed, watch } from "vue";
import axiosClient from "../api";
import StatusCircle from "./StatusCircle.vue"; // Компонент статуса

const props = defineProps({
  lead: Object,
  // Пропс для управления активной карточкой из родительского компонента
  activeLeadId: Number,
  setActiveLeadId: Function,
});

const expanded = ref(false);
const tasks = ref([]); // Массив для задач
const loading_task = ref(false);
const today = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);

// Слежение за активной карточкой. Закрываем карточку, если другая открыта
watch(
  () => props.activeLeadId,
  (newActiveId) => {
    if (newActiveId !== props.lead.id) {
      expanded.value = false;
      tasks.value = []; // Сброс задач при закрытии
    }
  }
);

// Функция для переключения отображения деталей
const toggleDetails = async () => {
  // Если карточка закрыта, ставим её активной
  if (!expanded.value) {
    props.setActiveLeadId(props.lead.id);
    await fetchTasks(); // Всегда делаем новый запрос при открытии
  } else {
    props.setActiveLeadId(null); // Закрываем карточку
  }
  expanded.value = !expanded.value;
};

// Скрипт получения актуальной задачи
const fetchActualTask = async () => {
  loading_task.value = true;
  await axiosClient
    .get(
      `/api/v4/tasks?filter[entity_id][]=${props.lead.id}&filter[complete_till][from]=${today}&order[complete_till]=asc&limit=1`
    )
    .then((response) => {
      tasks.value = response.data ? response.data._embedded.tasks : [];
    })
    .catch((error) => {
      console.error("Ошибка при получении актуальных задач:", error);
    })
    .finally(() => {
      loading_task.value = false;
    });
};

// Скрипт получения просроченных задач
const fetchFailedTask = async () => {
  loading_task.value = true;
  await axiosClient
    .get(
      `/api/v4/tasks?filter[entity_id][]=${props.lead.id}&filter[is_completed]=0&filter[complete_till][to]=${today}&order[complete_till]=desc&limit=1`
    )
    .then((response) => {
      tasks.value = response.data._embedded.tasks || [];
    })
    .catch((error) => {
      console.error("Ошибка при получении просроченных задач:", error);
    })
    .finally(() => {
      loading_task.value = false;
    });
};

// Функция для получения списка задач по сделке
const fetchTasks = async () => {
  await fetchActualTask();
  if (tasks.value.length === 0) {
    await fetchFailedTask();
  }
};

// Форматирование даты задачи в формате DD.MM.YYYY
const formatDate = (timestamp) => {
  return timestamp
    ? new Date(timestamp * 1000).toLocaleDateString("ru-RU")
    : "Нет данных";
};

// Логика для определения цвета статуса задачи
const statusColor = computed(() => {
  if (tasks.value.length === 0) return "status-red"; // Если задач нет
  const taskDate = tasks.value[0].complete_till * 1000;
  const todayDate = new Date().setHours(0, 0, 0, 0);

  if (taskDate < todayDate) {
    return "status-red"; // Просроченная задача
  } else if (taskDate === todayDate) {
    return "status-green"; // Задача на сегодня
  } else {
    return "status-yellow"; // Задача на будущее
  }
});
</script>

<template>
  <div class="lead-card" @click="toggleDetails">
    <!-- Основная информация о сделке -->
    <div class="lead-header">
      <h3>{{ props.lead.name }}</h3>
      <p><strong>ID:</strong> {{ props.lead.id }}</p>
      <p><strong>Бюджет:</strong> {{ props.lead.price }} руб.</p>
    </div>
    <div v-if="loading_task" class="spinner">
      <span class="loader"></span>
      <!-- Спиннер -->
    </div>
    <!-- Расширенная информация при клике -->
    <div v-if="expanded" class="lead-details">
      <div>
        <p>
          <strong>ID задачи:</strong> {{ tasks.length > 0 ? tasks[0].id : "Нет данных" }}
        </p>
        <p>
          <strong>Описание задачи:</strong>
          {{ tasks.length > 0 ? tasks[0].text : "Нет данных" }}
        </p>
        <p>
          <strong>Дата завершения:</strong>
          {{ tasks.length > 0 ? formatDate(tasks[0].complete_till) : "Нет данных" }}
        </p>

        <p>
          <!-- <strong>Статус:</strong>
          <svg :class="statusColor" viewBox="0 0 24 24" class="status-circle">
            <circle cx="12" cy="12" r="10" />
          </svg> -->
          <StatusCircle :complete_till="tasks[0].complete_till" />
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lead-card {
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #dde1e6;
  border-radius: 8px;
  background-color: #f0f8ff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.lead-card:hover {
  background-color: #e0f0ff;
  transform: scale(1.02);
}

.lead-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lead-details {
  margin-top: 16px;
  background-color: #eef7ff;
  padding: 12px;
  border-radius: 8px;
}

.status-circle {
  width: 24px;
  height: 24px;
  display: inline-block;
}

.status-red circle {
  fill: #ff4d4f;
}

.status-green circle {
  fill: #52c41a;
}

.status-yellow circle {
  fill: #faad14;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #007bff;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
