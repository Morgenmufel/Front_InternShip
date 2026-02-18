import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { deleteImageById } from '../features/images/imageSlice.js'
import { fetchProfile } from '../features/profile/profileSlice.js'
import './ImageCard.css'

export default function ImageCard({ imageId }) {
    const image = useSelector(s => s.images.byId?.[imageId]) // может быть undefined — это ок
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const [busy, setBusy] = useState(false)
    const access = useSelector(s => s.auth.accessToken)

    // Всегда есть URL контента — даже если метаданные в сторе не успели
    const src = `/api/images/${imageId}/content`

    const isOwner = (() => {
        if (!access || !image) return false // если image нет — просто не показываем delete
        try {
            const tokenPayload = JSON.parse(atob(access.split('.')[1]))
            return tokenPayload.sub === image.userId
        } catch {
            return false
        }
    })()

    const openPost = () => navigate(`/image/${imageId}`)

    const deleteImage = async (e) => {
        e.stopPropagation()
        if (!window.confirm("Delete this image?")) return
        if (busy) return
        setBusy(true)
        try {
            const action = await dispatch(deleteImageById(imageId))
            if (action?.payload && location.pathname.startsWith('/profile')) {
                try {
                    const payload = JSON.parse(atob(access.split('.')[1]))
                    if (payload?.sub) dispatch(fetchProfile({ userId: payload.sub, page: 0 }))
                } catch {}
            }
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="image-card" onClick={openPost} role="button" tabIndex={0}>
            <img
                src={src}
                alt={image?.description || 'image'}
                loading="lazy"
            />
            {isOwner && location.pathname.startsWith("/profile") && (
                <button className="delete-btn" onClick={deleteImage} disabled={busy}>
                    🗑️
                </button>
            )}
        </div>
    )
}
