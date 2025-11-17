import { useState } from 'react'
import './AuthForm.css'

const AuthForm = ({ onSubmit, title, mode = 'login', error = null }) => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = { email, password }
        if (mode === 'register') data.username = username
        onSubmit(data)
    }

    return (
        <div className="auth-form">
            <div className="auth-container">
                <h1 className="auth-title">{title}</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {mode === 'register' && (
                        <input
                            className="auth-input"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    )}
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <div className="auth-error">{error}</div>}
                    <button className="auth-button" type="submit">
                        {title}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AuthForm