import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import './LoginPage.css'
import axios from "axios";

export default function ResetPasswordPage() {
    const [params] = useSearchParams()
    const token = params.get('token')

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }

        if (!token) {
            setError("Invalid or missing token.")
            return
        }

        setLoading(true)
        setError('')

        try {
            await axios.post('auth/reset-password', {
                token,
                password
            })

            setDone(true)
        } catch (err) {
            console.error("Reset failed:", err)

            if (err.response?.status === 400) {
                setError('Invalid or expired token.')
            } else {
                setError('Something went wrong. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-title">Reset Password</h1>
                    <p className="login-subtitle">
                        Please enter your new password below and confirm it.
                    </p>
                </div>

                {!done ? (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-input-group">
                            <label htmlFor="password" className="login-label">New Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="login-input-group">
                            <label htmlFor="confirm" className="login-label">Confirm Password</label>
                            <input
                                id="confirm"
                                type="password"
                                placeholder="Repeat new password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                className="login-input"
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && <div className="login-error">{error}</div>}

                        <button
                            type="submit"
                            className={`login-button ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? '' : 'Reset Password'}
                        </button>
                    </form>
                ) : (
                    <div className="login-success">
                        <p>✅ Your password has been successfully reset.</p>
                        <Link to="/login" className="login-footer-link">Go to Login</Link>
                    </div>
                )}
            </div>
        </div>
    )
}
