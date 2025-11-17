import { getProfileApi } from './profileApi.js'

const getProfile = async (userId, page = 0, size = 9) => {
    const res = await getProfileApi(userId, page, size)
    return res.data
}

export default { getProfile }
