import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
    const navigate = useNavigate()

    const goBack = () => {
        navigate(-1)
    }

    return (
        <div className="not-found-page">
            {/* Декоративные элементы */}
            <div className="not-found-decoration"></div>
            <div className="not-found-decoration"></div>
            <div className="not-found-decoration"></div>

            <div className="not-found-container">
                <div className="not-found-icon">🔍</div>
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">Page Not Found</h2>
                <p className="not-found-description">
                    Oops! The page you're looking for seems to have wandered off into the digital void.
                    It might have been moved, deleted, or never existed in the first place.
                </p>

                <div className="not-found-actions">
                    <button
                        className="not-found-button primary"
                        onClick={goBack}
                    >
                        ← Go Back
                    </button>
                    <Link
                        to="/"
                        className="not-found-button secondary"
                    >
                        🏠 Home Page
                    </Link>
                </div>
            </div>
        </div>
    )
}