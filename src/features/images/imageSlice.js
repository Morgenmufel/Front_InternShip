import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import imageService from './imageService.js'
import commentService from '../comments/commentService.js'
import { fetchProfile } from "../profile/profileSlice"

export const fetchUserImages = createAsyncThunk(
    'images/fetchUserImages',
    async ({ userId, page = 0, size = 9 }, thunkAPI) => {
        try {
            return await imageService.getUserImages(userId, page, size)
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const fetchFeed = createAsyncThunk(
    'images/fetchFeed',
    async ({ page = 0, size = 9 }, thunkAPI) => {
        try {
            return await imageService.getAllImages(page, size)
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const fetchImage = createAsyncThunk(
    'images/fetchImage',
    async (id, thunkAPI) => {
        try {
            return await imageService.getImageById(id)
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const deleteImageById = createAsyncThunk(
    'images/deleteImage',
    async (imageId, thunkAPI) => {
        try {
            await imageService.deleteImage(imageId)
            return imageId
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const uploadImage = createAsyncThunk(
    'images/uploadImage',
    async (formData, thunkAPI) => {
        try {
            return await imageService.uploadImage(formData)
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const addComment = createAsyncThunk(
    'images/addComment',
    async ({ imageId, description }, thunkAPI) => {
        try {
            const newComment = await commentService.addComment(imageId, description)
            return { imageId, newComment }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message)
        }
    }
)

const initialState = {
    feed: { content: [], page: 0, last: false },
    userImages: null,
    profile: null,
    currentImage: null,
    loading: false,
    error: null,
    byId: {}
}

const slice = createSlice({
    name: 'images',
    initialState,

    reducers: {
        clearFeed(state) {
            state.feed = { content: [], page: 0, last: false }
        },

        updateImageLike(state, action) {
            const { targetId, liked, likesCount } = action.payload

            const apply = img =>
                img.id === targetId
                    ? { ...img, likedByCurrentUser: liked, likesCount }
                    : img

            if (state.byId[targetId]) {
                state.byId[targetId].likedByCurrentUser = liked
                state.byId[targetId].likesCount = likesCount
            }

            if (state.feed?.content)
                state.feed.content = state.feed.content.map(apply)

            if (state.profile?.images?.content)
                state.profile.images.content = state.profile.images.content.map(apply)

            if (state.userImages?.content)
                state.userImages.content = state.userImages.content.map(apply)

            if (state.currentImage?.id === targetId) {
                state.currentImage.likedByCurrentUser = liked
                state.currentImage.likesCount = likesCount
            }
        },

        addCommentToImage(state, action) {
            const { targetId } = action.payload

            const apply = img =>
                img.id === targetId
                    ? { ...img, commentsCount: (img.commentsCount ?? 0) + 1 }
                    : img

            if (state.byId[targetId]) {
                state.byId[targetId].commentsCount =
                    (state.byId[targetId].commentsCount ?? 0) + 1
            }

            if (state.feed?.content)
                state.feed.content = state.feed.content.map(apply)

            if (state.profile?.images?.content)
                state.profile.images.content = state.profile.images.content.map(apply)

            if (state.userImages?.content)
                state.userImages.content = state.userImages.content.map(apply)

            if (state.currentImage?.id === targetId) {
                state.currentImage.commentsCount =
                    (state.currentImage.commentsCount ?? 0) + 1
            }
        },

        updateImageCommentsCount(state, action) {
            const { imageId, commentsCount } = action.payload

            const apply = img =>
                img.id === imageId ? { ...img, commentsCount } : img

            if (state.byId[imageId]) {
                state.byId[imageId].commentsCount = commentsCount
            }

            if (state.feed?.content)
                state.feed.content = state.feed.content.map(apply)

            if (state.userImages?.content)
                state.userImages.content = state.userImages.content.map(apply)

            if (state.profile?.images?.content)
                state.profile.images.content = state.profile.images.content.map(apply)

            if (state.currentImage?.id === imageId)
                state.currentImage.commentsCount = commentsCount
        }
    },

    extraReducers: builder => {
        builder

            .addCase(fetchFeed.pending, state => {
                state.loading = true
                state.error = null
            })

            .addCase(fetchFeed.fulfilled, (state, action) => {
                state.loading = false
                const newFeed = action.payload
                const pageArg = action.meta.arg?.page ?? 0

                newFeed.content.forEach(img => {
                    state.byId[img.id] = img
                })

                if (pageArg === 0) {
                    state.feed = newFeed
                } else {
                    const existingIds = new Set(state.feed.content.map(img => img.id))
                    const uniqueNew = newFeed.content.filter(img => !existingIds.has(img.id))

                    state.feed.content = [...state.feed.content, ...uniqueNew]

                    state.feed.page = newFeed.pageable.pageNumber
                    state.feed.last = newFeed.last
                }
            })

            .addCase(fetchFeed.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false
                const newData = action.payload
                const pageArg = action.meta.arg?.page ?? 0

                newData.images.content.forEach(img => {
                    state.byId[img.id] = img
                })

                if (pageArg === 0 || !state.profile) {
                    state.profile = newData
                    return
                }

                const existing = state.profile.images.content
                const existingIds = new Set(existing.map(img => img.id))

                const uniqueNew = newData.images.content.filter(
                    img => !existingIds.has(img.id)
                )

                state.profile.images.content = [...existing, ...uniqueNew]

                state.profile.images.pageable.pageNumber =
                    newData.images.pageable.pageNumber

                state.profile.images.last = newData.images.last
            })

            .addCase(fetchUserImages.fulfilled, (state, action) => {
                state.loading = false
                state.userImages = action.payload

                action.payload.content.forEach(img => {
                    state.byId[img.id] = img
                })
            })

            .addCase(fetchImage.fulfilled, (state, action) => {
                state.loading = false
                state.currentImage = action.payload
                state.byId[action.payload.id] = action.payload
            })

            .addCase(deleteImageById.fulfilled, (state, action) => {
                const id = action.payload

                if (state.feed?.content)
                    state.feed.content = state.feed.content.filter(img => img.id !== id)

                if (state.userImages?.content)
                    state.userImages.content = state.userImages.content.filter(img => img.id !== id)

                if (state.profile?.images?.content)
                    state.profile.images.content = state.profile.images.content.filter(img => img.id !== id)

                if (state.currentImage?.id === id)
                    state.currentImage = null

                delete state.byId[id]
            })

            .addCase(addComment.fulfilled, (state, action) => {
                const { imageId } = action.payload

                const apply = img =>
                    img.id === imageId
                        ? { ...img, commentsCount: (img.commentsCount ?? 0) + 1 }
                        : img

                if (state.byId[imageId]) {
                    state.byId[imageId].commentsCount =
                        (state.byId[imageId].commentsCount ?? 0) + 1
                }

                if (state.feed?.content)
                    state.feed.content = state.feed.content.map(apply)

                if (state.userImages?.content)
                    state.userImages.content = state.userImages.content.map(apply)

                if (state.profile?.images?.content)
                    state.profile.images.content = state.profile.images.content.map(apply)

                if (state.currentImage?.id === imageId)
                    state.currentImage.commentsCount =
                        (state.currentImage.commentsCount ?? 0) + 1
            })

            .addCase(uploadImage.pending, state => {
                state.loading = true
                state.error = null
            })

            .addCase(uploadImage.fulfilled, (state, action) => {
                state.loading = false
                const newImg = action.payload

                state.byId[newImg.id] = newImg

                if (state.feed?.content)
                    state.feed.content = [newImg, ...state.feed.content]

                if (state.userImages?.content)
                    state.userImages.content = [newImg, ...state.userImages.content]
            })

            .addCase(uploadImage.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const {
    clearFeed,
    updateImageLike,
    addCommentToImage,
    updateImageCommentsCount
} = slice.actions

export default slice.reducer
