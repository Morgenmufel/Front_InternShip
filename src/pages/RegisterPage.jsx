import { useDispatch, useSelector } from 'react-redux'
import { register } from '../features/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import './LoginPage.css'

const RegisterPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, token } = useSelector((state) => state.auth)

    const handleRegister = (data) => {
        dispatch(register(data))
    }

    if (token) {
        navigate('/home')
    }

    return (
        <div className="login-page">
            <div className="login-form-container">
                <div className="login-card">
                    <h1 className="app-title">Registration</h1>
                    <AuthForm title="Register" onSubmit={handleRegister} mode="register" />
                    {loading && <p>Загрузка...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>

                {/* Ссылка на логин */}
                <div className="login-card">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="link-blue">
                            Sign in
                        </Link>
                    </p>
                </div>

                <footer className="login-footer">
                    <p>© 2025 MyApp</p>
                </footer>
            </div>
        </div>
    )
}

export default RegisterPage
