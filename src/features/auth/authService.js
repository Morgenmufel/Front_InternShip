import apiClient from './apiClient'

const register = async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
}

const login = async (userData) => {
    const response = await apiClient.post('/auth/login', userData)
    return response.data
}

export default { register, login}
