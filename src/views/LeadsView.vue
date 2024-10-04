<script setup>
// import { ref, onMounted } from 'vue';
// import axiosClient from '../api';
import LeadsTable from '@/components/LeadsTable.vue';
// const leads = ref([]);


// const fetchLeads = async () => {
//     try {
//         const response = await axiosClient.get('https://pilipenkomish.amocrm.ru/api/v4/leads');
//         leads.value = response.data._embedded.leads;
//     } catch (error) {
//         console.error('Ошибка при получении leads:', error);
//     }
// };

// onMounted(() => {
//     fetchLeads();

// })
</script>

<template>
    <LeadsTable />
    <!-- <div>
        {{ leads }}
        <div v-if="leads">
            <h2>Leads:</h2>
            <ul>
                <li v-for="lead in leads" :key="lead.id">{{ lead }}</li>
                 {{ leads }}
            </ul>
        </div>
    </div> -->
</template>