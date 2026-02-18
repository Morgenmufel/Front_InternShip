import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import profileService from './profileService.js'
import {deleteImageById} from "../images/imageSlice.js";
import { upsertMany } from "../images/imageSlice.js";

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async ({ userId, page = 0 }, thunkAPI) => {
        try {
            const data = await profileService.getProfile(userId, page)
            thunkAPI.dispatch(upsertMany(data.images?.content ?? []))
            return data
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
                const incoming = action.payload
                const pageArg = action.meta.arg?.page ?? 0
                incoming.images?.content?.forEach(img => {
                    state.byId[img.id] = img
                })
                if (!state.profile || pageArg === 0) {
                    state.profile = incoming
                    return
                }
                const existing = state.profile.images?.content ?? []
                const existingIds = new Set(existing.map(i => i.id))
                const uniqueNew = (incoming.images?.content ?? []).filter(i => !existingIds.has(i.id))
                state.profile.images.content = [...existing, ...uniqueNew]
                state.profile.images.pageable = incoming.images.pageable
                state.profile.images.totalPages = incoming.images.totalPages
                state.profile.images.totalElements = incoming.images.totalElements
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
