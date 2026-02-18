import axios from "axios";

const login = async (data) => {
    const res = await axios.post('auth/login', data)
    return res.data
}

const register = async (data) => {
    const res = await axios.post('auth/register', data)
    return res.data
}


export default { login, register }
