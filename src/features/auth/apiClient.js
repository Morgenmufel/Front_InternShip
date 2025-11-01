import axios from 'axios'

const API_URL = 'http://localhost:8080'

const apiClient = axios.create({
    baseURL: API_URL,
})

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (
        token &&
        !config.url.endsWith('/auth/login') &&
        !config.url.endsWith('/auth/register') &&
        !config.url.endsWith('/auth/refresh-token')
    ) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
}, (error) => {
    return Promise.reject(error)
})

export default apiClient
