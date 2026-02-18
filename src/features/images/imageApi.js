import apiClient from '../auth/apiClient.js'
export const uploadImageApi = (formData) =>
    apiClient.post(`/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const getImageByIdApi = (id) =>
    apiClient.get(`/images/${id}`)

export const getUserImagesApi = (userId, page = 0, size = 9) =>
    apiClient.get(`/user/${userId}/images?page=${page}&size=${size}`)

export const getAllImagesApi = (page = 0, size = 9) =>
    apiClient.get(`/images?page=${page}&size=${size}`)

export const deleteImageApi = (imageId) =>
    apiClient.delete(`/images/${imageId}`)
