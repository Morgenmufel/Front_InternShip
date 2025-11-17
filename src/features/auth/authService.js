import apiClient from '/src/features/auth/apiClient.js'

const login = async (data) => {
    const res = await apiClient.post('auth/login', data)
    return res.data
}

const register = async (data) => {
    const res = await apiClient.post('auth/register', data)
    return res.data
}


export default { login, register }
