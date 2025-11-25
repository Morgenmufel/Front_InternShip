import apiClient from '../auth/apiClient.js'

export const likeImageApi = (imageId) => apiClient.post(`api/images/${imageId}/likes`)
export const likeCommentApi = (commentId) => apiClient.post(`api/comments/${commentId}/likes`)
