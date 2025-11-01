import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

// Создаём store приложения
export const store = configureStore({
    reducer: {
        auth: authReducer, // Подключаем редьюсер авторизации
    },
})
