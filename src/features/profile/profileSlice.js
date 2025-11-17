import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import profileService from './profileService.js'
import {deleteImageById} from "../images/imageSlice.js";

export const fetchProfile = createAsyncThunk(
    'api/profile/fetchProfile',
    async ({ userId, page = 0 }, thunkAPI) => {
        try {
            return await profileService.getProfile(userId, page)
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message)
        }
    }
)

const initialState = {
    profile: null,
    page: 0,
    loading: false,
    error: null,
    byId: {}
}

const slice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile(state) {
            state.profile = null
            state.page = 0
            state.loading = false
            state.error = null
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false
                state.profile = action.payload
                action.payload.images.content.forEach(img => {
                    state.byId[img.id] = img
                })
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteImageById.fulfilled, (state, action) => {
                if (state.profile?.images?.content) {
                    state.profile.images.content =
                        state.profile.images.content.filter(img => img.id !== action.payload)

                    state.profile.images.totalElements -= 1
                }
            })

    }
})

export const { clearProfile } = slice.actions
export default slice.reducer
