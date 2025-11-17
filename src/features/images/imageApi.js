import apiClient from '../auth/apiClient.js'

export const uploadImageApi = (formData) =>
    apiClient.post('api/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const getImageByIdApi = (id) =>
    apiClient.get(`api/images/${id}`)

export const getUserImagesApi = (userId, page = 0, size = 9) =>
    apiClient.get(`api/user/${userId}/images?page=${page}&size=${size}`)

export const getAllImagesApi = (page = 0, size = 9) =>
    apiClient.get(`api/images?page=${page}&size=${size}`)

export const deleteImageApi = (imageId) =>
    apiClient.delete(`api/images/${imageId}`)
