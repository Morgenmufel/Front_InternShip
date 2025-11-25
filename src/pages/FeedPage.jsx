import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeed } from '../features/images/imageSlice'
import ImageCard from '../components/ImageCard'
import { useInfiniteScroll } from '../utils/infiniteScroll'
import Loader from '../components/Loader'
import './FeedPage.css'
import Navbar from '../components/Navbar'

export default function FeedPage() {
    const dispatch = useDispatch()
    const { feed, loading } = useSelector(s => s.images)
    const page = feed?.page ?? 0
    const hasMore = !feed?.last

    const loadMore = useCallback(() => {
        dispatch(fetchFeed({ page: page + 1 }))
    }, [dispatch, page])

    useEffect(() => {
        if (!feed || !feed.content.length) dispatch(fetchFeed({ page: 0 }))
    }, [])

    const observerRef = useInfiniteScroll(loadMore, loading, hasMore)

    if (!loading && (!feed || !feed.content.length)) {
        return (
            <div className="feed-page">
                <div className="feed-empty">
                    <div className="feed-empty-icon">📷</div>
                    <h2 className="feed-empty-title">No posts yet</h2>
                    <p className="feed-empty-text">
                        Follow some users or upload your first photo to see posts here!
                    </p>
                    <button
                        className="feed-empty-button"
                        onClick={() => window.location.href = '/upload'}
                    >
                        Upload First Photo
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="feed-page">
            <div className="feed-grid">
                {feed?.content?.map(img => (
                    <ImageCard key={img.id} imageId={img.id} />
                ))}
            </div>
            <div ref={observerRef} className="feed-observer" />
            {loading && <Loader type="spinner" text="Loading more posts..." />}
            {!hasMore && <div className="feed-end">You've seen all posts!</div>}
            <Navbar />
        </div>
    )
}