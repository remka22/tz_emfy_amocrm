import { ref } from 'vue'
import { defineStore } from 'pinia'
import axiosClient from "../api.js";


export const useAuthStore = defineStore('auth', () => {
    const userInfo = ref({
        token: '',
        name: '',
    })
    const isLogined = ref(false)
    const error = ref('')
    const loader = ref(false)

    const clientId = '77b4fa25-d2eb-4352-9ee7-0af775381965'
    const clientSecret = 'U9vwiopdskdxX9z9AXHsAuw1xYzixUU9XBAUiMIjUOsCsAMmoyKHcOSzYlYWPpjZ'
    const redirectUri = 'http://localhost:5173/login'

    const auth = async (code) => {
        error.value = '';
        loader.value = true;
        await axiosClient.post(`/oauth2/access_token`, {
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri
        })
            .then(response => {
                localStorage.setItem('ACCESS_TOKEN', response.data.access_token)
                // console.log(response.data.access_token);
                
                isLogined.value = true
            })
            .catch(function (error) {
                isLogined.value = false
                console.log(error);
                throw error.value;
            })
            .finally(() => {
                loader.value = false;
            });
    }

    const user = async () => {
        error.value = '';
        loader.value = true;
        try {
            let response = await axiosClient.get(`api/v4/account`);
            // console.log(response)
            userInfo.value.name = response.data.name,
            isLogined.value = true
        } catch (err) {
            console.log(err);
            isLogined.value = false
        } finally {
            loader.value = false;
        }
    }

    const logout = () => {
        userInfo.value = {
            token: '',
            name: '',
        }
        isLogined.value = false
    }


    return { auth, user, userInfo, error, loader, logout, isLogined }
})
