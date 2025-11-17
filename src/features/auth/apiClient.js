import axios from 'axios'
import { store } from '/src/app/store.js'
import { logout, setTokens } from '/src/features/auth/authSlice.js'

const API_URL = 'http://localhost:8080'

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

const AUTH_WHITELIST = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/refresh-token'
]

apiClient.interceptors.request.use((config) => {
    const state = store.getState().auth
    const access = state.accessToken || localStorage.getItem('accessToken')

    if (access) {
        config.headers.Authorization = `Bearer ${access}`
    }

    return config
})

let isRefreshing = false
let queue = []

const processQueue = (error, token = null) => {
    queue.forEach((prom) => {
        if (error) prom.reject(error)
        else prom.resolve(token)
    })
    queue = []
}

apiClient.interceptors.response.use(
    res => res,
    async (error) => {
        const original = error.config

        if (!error.response) return Promise.reject(error)

        if (AUTH_WHITELIST.some(path => original.url.includes(path))) {
            return Promise.reject(error)
        }
        if (error.response.status === 401 && !original._retry) {
            original._retry = true

            const state = store.getState().auth
            const refresh = state.refreshToken || localStorage.getItem('refreshToken')

            if (!refresh) {
                store.dispatch(logout())
                window.location.href = '/login'
                return Promise.reject(error)
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({ resolve, reject })
                }).then((newToken) => {
                    original.headers.Authorization = `Bearer ${newToken}`
                    return apiClient(original)
                })
            }

            isRefreshing = true

            try {
                console.log('[REFRESH] requesting new tokens...')
                const resp = await axios.post(
                    `${API_URL}/auth/refresh-token`,
                    { refreshToken: refresh },
                    { withCredentials: true }
                )

                console.log('[REFRESH] response:', resp.data)

                const newAccess = resp.data.token
                const newRefresh = resp.data.refreshToken

                if (!newAccess || !newRefresh) {
                    throw new Error('Refresh response missing tokens')
                }

                store.dispatch(setTokens({ accessToken: newAccess, refreshToken: newRefresh }))
                localStorage.setItem('accessToken', newAccess)
                localStorage.setItem('refreshToken', newRefresh)

                processQueue(null, newAccess)

                original.headers.Authorization = `Bearer ${newAccess}`
                console.log('[REFRESH] retrying original request:', original.url)

                return apiClient(original)
            } catch (err) {
                console.error('[REFRESH] failed:', err)
                processQueue(err, null)
                store.dispatch(logout())
                window.location.href = '/login'
                return Promise.reject(err)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient
