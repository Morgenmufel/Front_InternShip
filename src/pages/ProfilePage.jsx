import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile } from '../features/profile/profileSlice.js'
import { parseJwt } from '../utils/jwt.js'
import { useNavigate } from 'react-router-dom'
import ImageCard from '../components/ImageCard.jsx'
import Loader from '../components/Loader.jsx'
import Navbar from '../components/Navbar.jsx'
import './ProfilePage.css'

export default function ProfilePage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { accessToken } = useSelector(s => s.auth)
    const { profile, loading, error } = useSelector(s => s.profile)

    const [page, setPage] = useState(0)
    const [activeTab, setActiveTab] = useState('posts')

    const decoded = accessToken ? parseJwt(accessToken) : null
    const userId = decoded?.sub

    useEffect(() => {
        if (userId) {
            dispatch(fetchProfile({ userId, page: 0 }))
        }
    }, [userId])

    if (loading && !profile) {
        return (
            <>
                <Navbar />
                <div className="profile-loading">
                    <Loader type="spinner" text="Loading profile..." />
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="profile-error">
                    <div className="profile-error-icon">😔</div>
                    <h2 className="profile-error-title">Profile not found</h2>
                    <p className="profile-error-text">
                        The profile you're looking for doesn't exist or may have been removed.
                    </p>
                    <button
                        className="profile-error-button"
                        onClick={() => navigate('/profile')}
                    >
                        Back to Profile
                    </button>
                </div>
            </>
        )
    }

    if (!profile) return null

    const images = profile.images?.content ?? []
    const postsCount = profile.images?.totalElements ?? 0
    const hasMore = profile.images && (profile.images.pageable?.pageNumber < (profile.images.totalPages - 1))

    const getInitials = (username) => username ? username.charAt(0).toUpperCase() : 'U'

    return (
        <>
            <Navbar />

            <div className="profile-page">
                <div className="profile-header">
                    <div className="profile-info">
                        <div className="profile-avatar">{getInitials(profile.username)}</div>
                        <div className="profile-details">
                            <h1 className="profile-username">{profile.username}</h1>

                            <div className="profile-stats">
                                <div className="profile-stat">
                                    <span className="profile-stat-count">{postsCount}</span>
                                    <span className="profile-stat-label">Posts</span>
                                </div>
                            </div>

                            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                        </div>
                    </div>
                </div>

                <section className="profile-tabs">
                    <div className="tabs-navigation">
                        <button
                            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            📷 Posts
                        </button>
                    </div>

                    {activeTab === 'posts' && (
                        <>
                            {images.length === 0 ? (
                                <div className="posts-grid empty">
                                    <div className="empty-posts-icon">📸</div>
                                    <h3 className="empty-posts-title">No posts yet</h3>
                                    <p className="empty-posts-text">
                                        When {profile.username} shares photos and videos, you'll see them here.
                                    </p>
                                </div>
                            ) : (
                                <div className="posts-grid">
                                    {images.map(img => (
                                        <ImageCard key={img.id} imageId={img.id} />
                                    ))}
                                </div>
                            )}

                            {hasMore && (
                                <button
                                    className="load-more"
                                    onClick={() => {
                                        const next = (profile.images.pageable?.pageNumber ?? page) + 1
                                        setPage(next)
                                        dispatch(fetchProfile({ userId, page: next }))
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </button>
                            )}
                        </>
                    )}
                </section>
            </div>
        </>
    )
}
