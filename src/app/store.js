import { configureStore } from '@reduxjs/toolkit'
import authReducer from '/src/features/auth/authSlice.js'
import imageReducer from '/src/features/images/imageSlice.js'
import profileReducer from '/src/features/profile/profileSlice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        images: imageReducer,
        profile: profileReducer,
    },
})
