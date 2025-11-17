import { useEffect, useRef } from 'react'

export function useInfiniteScroll(callback, loading, hasMore) {
    const observerRef = useRef(null)

    useEffect(() => {
        if (loading) return
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) callback()
        }, { root: null, rootMargin: '200px' })

        if (observerRef.current) obs.observe(observerRef.current)
        return () => obs.disconnect()
    }, [callback, loading, hasMore])

    return observerRef
}
