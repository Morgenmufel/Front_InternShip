import apiClient from '../auth/apiClient.js'
export const getProfileApi = (userId, page = 0, size = 9) =>
    apiClient.get(`/profile/${userId}?page=${page}&size=${size}`)
