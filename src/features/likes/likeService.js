import { likeImageApi, likeCommentApi } from './likeApi.js'

const toggleImageLike = async (imageId) => {
    const res = await likeImageApi(imageId)
    return res.data
}

const toggleCommentLike = async (commentId) => {
    const res = await likeCommentApi(commentId)
    return res.data
}

export default { toggleImageLike, toggleCommentLike }
