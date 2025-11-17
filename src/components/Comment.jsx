import React, { useState } from 'react'
import likeService from '../features/likes/likeService'
import commentService from '../features/comments/commentService'
import { useSelector, useDispatch } from 'react-redux'
import './Comment.css'
import { fetchImage } from '../features/images/imageSlice'

export default function Comment({ comment, imageId, onChange }) {
    const dispatch = useDispatch()
    const currentUser = useSelector(s => {
        const token = s.auth?.accessToken
        if (!token) return null
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload.username || payload.sub
        } catch { return null }
    })

    const [editing, setEditing] = useState(false)
    const [text, setText] = useState(comment.description)
    const [loading, setLoading] = useState(false)

    const handleLike = async () => {
        setLoading(true)
        try {
            await likeService.toggleCommentLike(comment.id)
            if (imageId) dispatch(fetchImage(imageId))
            if (onChange) onChange()
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    const saveEdit = async () => {
        setLoading(true)
        try {
            await commentService.updateComment(comment.id, text)
            setEditing(false)
            if (imageId) dispatch(fetchImage(imageId))
            if (onChange) onChange()
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    const deleteIt = async () => {
        if (!window.confirm('Delete comment?')) return
        setLoading(true)
        try {
            await commentService.deleteComment(comment.id)
            if (imageId) dispatch(fetchImage(imageId))
            if (onChange) onChange()
        } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    return (
        <div className="comment-item">
            <div className="comment-header">
                <b>{comment.username}</b>
                <span className="comment-time"></span>
            </div>

            {editing ? (
                <>
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        disabled={loading}
                    />
                    <div className="edit-buttons">
                        <button onClick={saveEdit} disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={() => setEditing(false)} disabled={loading}>
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <p>{comment.description}</p>
            )}

            <div className="comment-actions">
                <button onClick={handleLike} disabled={loading}>
                    {comment.likedByCurrentUser ? '♥' : '♡'} {comment.likesCount ?? 0}
                </button>

                {comment.username === currentUser && !editing && (
                    <>
                        <button onClick={() => setEditing(true)} disabled={loading}>
                            Edit
                        </button>
                        <button onClick={deleteIt} disabled={loading}>
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
