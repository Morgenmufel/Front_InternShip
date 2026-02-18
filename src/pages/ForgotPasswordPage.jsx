import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './LoginPage.css'
import axios from "axios";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return
        setLoading(true)

        try {
            await axios.post('auth/forgot-password', { email })
            setSent(true)
        } catch (err) {
            console.error("Failed to send reset email:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-title">Forgot Password</h1>
                    <p className="login-subtitle">
                        Enter your email address below, and we’ll send you a link to reset your password.
                    </p>
                </div>

                {!sent ? (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-input-group">
                            <label htmlFor="email" className="login-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className={`login-button ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? '' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <div className="login-success">
                        <p>
                            ✅ If an account with <strong>{email}</strong> exists, we’ve sent a password reset link to it.
                        </p>
                    </div>
                )}

                <div className="login-footer">
                    <Link to="/login" className="login-footer-link">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
