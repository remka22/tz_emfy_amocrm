<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/user-store';
import axiosClient from '../api'

let router = useRouter()
const user = useAuthStore();

const clientId = '77b4fa25-d2eb-4352-9ee7-0af775381965'
const authUrl = `https://www.amocrm.ru/oauth?client_id=${clientId}&mode=popup`
const link = ref(authUrl)

onMounted(() => {
    const code = router.currentRoute.value.query.code
    if (code) {
        user.auth( code )
    }
});

</script>

<template>
    <div>
        <strong>Пожалуйста авторизуйтесь</strong>
    </div>
    <div>
        <a v-bind:href="link">Авторезироваться</a>
    </div>
</template>