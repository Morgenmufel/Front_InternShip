import apiClient from '../auth/apiClient.js'

export const getProfileApi = (userId, page = 0, size = 9) =>
    apiClient.get(`api/profile/${userId}?page=${page}&size=${size}`)
