import apiClient from '../auth/apiClient.js'

export const addCommentApi = (imageId, description) =>
    apiClient.post(`api/images/${imageId}/comments`, { description })

export const updateCommentApi = (commentId, description) =>
    apiClient.put(`api/images/comments/${commentId}`, { description })

export const deleteCommentApi = (commentId) =>
    apiClient.delete(`api/images/comments/${commentId}`)
