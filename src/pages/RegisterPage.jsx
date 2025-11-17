import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../features/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import './RegisterPage.css'

const RegisterPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { loading, error, success } = useSelector((state) => state.auth)

    const handleRegister = (data) => {
        dispatch(register(data))
    }

    useEffect(() => {
        if (success) {
            navigate('/login')
        }
    }, [success])

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-header">
                    <h1 className="register-title">RenyaGram</h1>
                    <p className="register-subtitle">Create your account</p>
                </div>

                <AuthForm
                    title="Register"
                    onSubmit={handleRegister}
                    mode="register"
                    error={error}
                />

                {loading && (
                    <div className="register-success">
                        Creating your account...
                    </div>
                )}

                {success && (
                    <div className="register-success">
                        Account created successfully! Redirecting to login...
                    </div>
                )}

                <div className="register-footer">
                    <span className="register-footer-text">
                        Already have an account?
                    </span>
                    <Link to="/login" className="register-footer-link">
                        Sign in
                    </Link>
                </div>

                <div className="register-app-footer">
                    <p>© 2025 RenyaGram</p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage