import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchImage, updateImageLike } from '../features/images/imageSlice'
import CommentList from '../components/CommentList'
import Loader from '../components/Loader'
import likeService from '../features/likes/likeService.js'
import Navbar from '../components/Navbar'
import './ImageDetailPage.css'
import { fetchProfile } from "../features/profile/profileSlice.js";

export default function ImageDetailPage() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { currentImage: img, loading, error } = useSelector(s => s.images)

    useEffect(() => {
        if (id) dispatch(fetchImage(id))
    }, [id, dispatch])

    useEffect(() => {
        if (img?.userId) {
            dispatch(fetchProfile({ userId: img.userId, page: 0 }))
        }
    }, [img, dispatch])

    if (loading) return (
        <>
            <Navbar />
            <div className="detail-loading">
                <Loader type="spinner" text="Loading post..." />
            </div>
        </>
    )

    if (error || !img) return (
        <>
            <Navbar />
            <div className="detail-error">
                <div className="detail-error-icon">📷</div>
                <h2 className="detail-error-title">Post not found</h2>
                <p className="detail-error-text">
                    The post you're looking for doesn't exist or may have been removed.
                </p>
                <button
                    className="detail-error-button"
                    onClick={() => navigate('/feed')}
                >
                    Back to Feed
                </button>
            </div>
        </>
    )

    const getInitials = (username) => username ? username.charAt(0).toUpperCase() : 'U'

    const handleLikeClick = async () => {
        try {
            const resp = await likeService.toggleImageLike(img.id)
            if (resp && resp.targetId) {
                dispatch(updateImageLike(resp))
            } else {
                dispatch(fetchImage(img.id))
            }
        } catch (e) {
            console.error('Like failed:', e)
        }
    }

    return (
        <>
            <Navbar />

            <div className="image-detail-page">

                <button
                    className="back-button"
                    onClick={() => navigate('/feed')}
                >
                    ← Back to Feed
                </button>

                <div className="image-column">
                    <img src={img.url} alt={img.description} />
                </div>

                <aside className="meta-column">
                    <div className="user-header">
                        <div className="user-avatar">
                            {getInitials(img.username)}
                        </div>
                        <div className="user-info">
                            <h3>{img.username}</h3>
                            <p>Posted photo</p>
                        </div>
                    </div>

                    {img.description && (
                        <div className="image-description">
                            <p>{img.description}</p>
                        </div>
                    )}

                    <div className="image-stats">
                        <button
                            className="like-button"
                            onClick={handleLikeClick}
                        >
                            {img.likedByCurrentUser ? '♥' : '♡'} {img.likesCount} likes
                        </button>
                        <div className="stat-item comments">
                            <span>💬</span>
                            <span>{img.commentsCount} comments</span>
                        </div>
                    </div>

                    <div className="comments-section">
                        <CommentList image={img} onRefresh={() => dispatch(fetchImage(id))}/>
                    </div>
                </aside>
            </div>
        </>
    )
}
