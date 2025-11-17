import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import commentService from '../features/comments/commentService.js'
import Comment from './Comment'
import './CommentList.css'
import { addCommentToImage } from '../features/images/imageSlice.js'

export default function CommentList({ image, onRefresh }) {
    const [text, setText] = useState('')
    const [posting, setPosting] = useState(false)
    const dispatch = useDispatch()

    const post = async () => {
        if (!text.trim()) return
        setPosting(true)
        try {
            const res = await commentService.addComment(image.id, text)
            dispatch(addCommentToImage({
                imageId: image.id,
                comment: res,
                commentsCount: (image.commentsCount ?? 0) + 1
            }))

            setText('')
            if (onRefresh) onRefresh()
        } catch (e) { console.error(e) } finally { setPosting(false) }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            post()
        }
    }

    return (
        <div className="comments">
            <div className="comment-create">
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a comment..."
                    disabled={posting}
                />
                <button onClick={post} disabled={posting || !text.trim()}>
                    {posting ? 'Posting...' : 'Post'}
                </button>
            </div>

            <div className="comment-list">
                {image.comments?.map(c => <Comment key={c.id} comment={c} imageId={image.id} onChange={() => dispatch(addCommentToImage({ imageId: image.id }))} />)}
            </div>
        </div>
    )
}
