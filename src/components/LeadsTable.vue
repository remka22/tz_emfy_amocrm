<template>
  <div class="lead-table">
    <h2>Список сделок</h2>
    <div class="lead-cards">
      <LeadCard
        v-for="lead in leads"
        :key="lead.id"
        :lead="lead"
        :activeLeadId="activeLeadId"
        :setActiveLeadId="setActiveLeadId"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosClient from "../api";
import LeadCard from "./LeadCard.vue"; // Импортируем компонент карточки

const leads = ref([]); // Массив для списка сделок
const activeLeadId = ref(null); // ID активной карточки

// Функция для установки активной карточки
const setActiveLeadId = (id) => {
  activeLeadId.value = id;
};

// Получение списка сделок при монтировании компонента
const fetchLeads = async () => {
  try {
    const response = await axiosClient.get("/api/v4/leads?limit=50");
    leads.value = response.data._embedded.leads || [];
  } catch (error) {
    console.error("Ошибка при получении сделок:", error);
  }
};

onMounted(() => {
  fetchLeads();
});
</script>

<style scoped>
.lead-table {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.lead-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
