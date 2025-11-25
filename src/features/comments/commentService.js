import { addCommentApi, updateCommentApi, deleteCommentApi } from './commentApi.js'

const addComment = async (imageId, description) => {
    const res = await addCommentApi(imageId, description)
    return res.data
}

const updateComment = async (commentId, description) => {
    const res = await updateCommentApi(commentId, description)
    return res.data
}

const deleteComment = async (commentId) => {
    await deleteCommentApi(commentId)
    return true
}

export default { addComment, updateComment, deleteComment }
