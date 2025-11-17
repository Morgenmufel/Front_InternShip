import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { deleteImageById } from '../features/images/imageSlice.js'
import { fetchProfile } from '../features/profile/profileSlice.js'
import './ImageCard.css'

export default function ImageCard({ imageId }) {
    const image = useSelector(s => s.images.byId[imageId])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const [busy, setBusy] = useState(false)
    const access = useSelector(s => s.auth.accessToken)

    if (!image) {
        return (
            <div className="image-card image-card--empty" aria-hidden>
                <div className="image-placeholder">Loading…</div>
            </div>
        )
    }

    const isOwner = access && (() => {
        try {
            const tokenPayload = JSON.parse(atob(access.split('.')[1]))
            return tokenPayload.sub === image.userId
        } catch {
            return false
        }
    })()

    const openPost = () => navigate(`/image/${image.id}`)

    const deleteImage = async (e) => {
        e.stopPropagation()
        if (!window.confirm("Delete this image?")) return
        if (busy) return
        setBusy(true)

        try {
            const action = await dispatch(deleteImageById(image.id))

            if (action?.payload && location.pathname.startsWith('/profile')) {
                try {
                    const payload = JSON.parse(atob(access.split('.')[1]))
                    if (payload?.sub) {
                        dispatch(fetchProfile({ userId: payload.sub, page: 0 }))
                    }
                } catch (err) {
                }
            }
        } catch (err) {
            console.error("Failed to delete:", err)
            alert('Failed to delete image')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div
            className="image-card"
            onClick={openPost}
            role="button"
            tabIndex={0}
        >
            <img src={image.url} alt={image.description || 'image'} loading="lazy" />
            {isOwner && location.pathname.startsWith("/profile") && (
                <button className="delete-btn" onClick={deleteImage} disabled={busy}>
                    🗑️
                </button>
            )}
        </div>
    )
}
