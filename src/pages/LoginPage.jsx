import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import { parseJwt } from '../utils/jwt'
import './LoginPage.css'

const LoginPage = () => {
    const [form, setForm] = useState({ email: '', password: '' })
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { accessToken, loading, error } = useSelector(state => state.auth)

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(login(form))
    }

    useEffect(() => {
        if (accessToken) {
            const decoded = parseJwt(accessToken)
            if (decoded && decoded.sub) navigate(`/profile`)
        }
    }, [accessToken])

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-title">RenyaGram</h1>
                    <p className="login-subtitle">Sign in to your account</p>
                </div>

                <form onSubmit={onSubmit} className="login-form">
                    <div className="login-input-group">
                        <label htmlFor="email" className="login-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="login-input"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="login-input-group">
                        <label htmlFor="password" className="login-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="login-input"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="login-forgot">
                        <Link to="/forgot-password" className="login-forgot-link">
                            Did you forget your password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={`login-button ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? '' : 'Sign In'}
                    </button>

                    {error && (
                        <div className="login-error">
                            {error.message || "Login error. Please check your credentials."}
                        </div>
                    )}
                </form>

                <div className="login-footer">
                    <span className="login-footer-text">Don't have an account?</span>
                    <Link to="/register" className="login-footer-link">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
