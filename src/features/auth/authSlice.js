import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService.js'

const initialState = {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    loading: false,
    error: null,
    success: false
}

export const login = createAsyncThunk(
    'auth/login',
    async (data, thunkAPI) => {
        try {
            return await authService.login(data)
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response?.data || e.message)
        }
    }
)

export const register = createAsyncThunk(
    'auth/register',
    async (data, thunkAPI) => {
        try {
            return await authService.register(data)
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response?.data || e.message)
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.accessToken = null
            state.refreshToken = null
            localStorage.clear()
        },
        setTokens: (state, action) => {
            const { accessToken, refreshToken } = action.payload
            state.accessToken = accessToken
            state.refreshToken = refreshToken
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.accessToken = action.payload.token
                state.refreshToken = action.payload.refreshToken

                localStorage.setItem("accessToken", action.payload.token)
                localStorage.setItem("refreshToken", action.payload.refreshToken)
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(register.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = true
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { logout, setTokens } = authSlice.actions
export default authSlice.reducer
