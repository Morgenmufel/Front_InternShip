import {
    uploadImageApi,
    getImageByIdApi,
    getUserImagesApi,
    getAllImagesApi,
    deleteImageApi
} from './imageApi.js'

const uploadImage = async (formData) => {
    const res = await uploadImageApi(formData)
    return res.data
}

const getImageById = async (id) => {
    const res = await getImageByIdApi(id)
    return res.data
}

const getUserImages = async (userId, page = 0, size = 9) => {
    const res = await getUserImagesApi(userId, page, size)
    return res.data
}

const getAllImages = async (page = 0, size = 9) => {
    const res = await getAllImagesApi(page, size)
    return res.data
}

const deleteImage = async (imageId) => {
    await deleteImageApi(imageId)
    return true
}

export default {
    uploadImage,
    getImageById,
    getUserImages,
    getAllImages,
    deleteImage
}
