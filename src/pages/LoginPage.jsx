import { useDispatch, useSelector } from 'react-redux'
import { login } from '../features/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import './LoginPage.css'

const LoginPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, token } = useSelector((state) => state.auth)

    const handleLogin = (data) => {
        dispatch(login(data))
    }

    // Если токен появился — редиректим, например, на /home
    if (token) {
        navigate('/home')
    }

    return (
        <div className="login-page">
            <div className="login-image">
                <img
                    src="https://static.cdninstagram.com/images/instagram/xig/homepage/screenshots/screenshot1.png"
                    alt="App preview"
                />
            </div>

            <div className="login-form-container">
                <div className="login-card">
                    <h1 className="app-title">Renyagram</h1>
                    <AuthForm title="Login" onSubmit={handleLogin} mode="login" />
                    {loading && <p>Загрузка...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>

                {/* Ссылка на регистрацию */}
                <div className="login-card">
                    <p>
                        Hasn`t registered yet?{' '}
                        <Link to="/register" className="link-blue">
                           Sign up
                        </Link>
                    </p>
                </div>

                <footer className="login-footer">
                    <p>© 2025 Renyagram</p>
                </footer>
            </div>
        </div>
    )
}

export default LoginPage
