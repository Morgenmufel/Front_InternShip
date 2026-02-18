import apiClient from '../auth/apiClient.js'


export const addCommentApi = (imageId, description) =>
    apiClient.post(`/images/${imageId}/comments`, { description })

export const updateCommentApi = (commentId, description) =>
    apiClient.put(`/images/comments/${commentId}`, { description })

export const deleteCommentApi = (commentId) =>
    apiClient.delete(`/images/comments/${commentId}`)
