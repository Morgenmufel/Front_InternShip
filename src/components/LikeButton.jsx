import React, { useState, useEffect } from 'react'
import './LikeButton.css'

export default function LikeButton({ liked: initialLiked = false, count: initialCount = 0, onToggle, size = 'medium' }) {
    const [loading, setLoading] = useState(false)
    const [liked, setLiked] = useState(initialLiked)
    const [count, setCount] = useState(initialCount)

    useEffect(() => {
        setLiked(initialLiked)
    }, [initialLiked])

    useEffect(() => {
        setCount(initialCount)
    }, [initialCount])

    const handle = async (e) => {
        e.stopPropagation()
        if (loading) return
        setLoading(true)
        const optimistic = !liked
        setLiked(optimistic)
        setCount(prev => optimistic ? prev + 1 : prev - 1)

        try {
            if (onToggle) await onToggle(optimistic)
        } catch (err) {
            setLiked(!optimistic)
            setCount(prev => optimistic ? prev - 1 : prev + 1)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            className={`like-button ${liked ? 'liked' : ''} ${loading ? 'loading' : ''} ${size}`}
            onClick={handle}
            disabled={loading}
            aria-label={liked ? 'Unlike' : 'Like'}
        >
            <span>{liked ? '♥' : '♡'}</span>
            <span className="count">{count}</span>
        </button>
    )
}
