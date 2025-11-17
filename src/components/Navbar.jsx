import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import './Navbar.css'

export default function Navbar() {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const { accessToken } = useSelector(s => s.auth)
    const isAuthenticated = !!accessToken

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        navigate('/login')
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    const isActive = (path) => location.pathname === path

    if (!isAuthenticated) return null
    return (
        <nav className="navbar">
            <div className="navbar-content">

                <Link to="/" className="navbar-brand">
                    RenyaGram
                </Link>

                <button
                    className="navbar-mobile-toggle"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>

                <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>

                    <Link
                        to="/feed"
                        className={`navbar-link ${isActive('/feed') ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Feed
                    </Link>

                    <Link
                        to="/profile"
                        className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Profile
                    </Link>

                    <Link
                        to="/upload"
                        className={`navbar-link ${isActive('/upload') ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Upload
                    </Link>

                    <button
                        className="navbar-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}
