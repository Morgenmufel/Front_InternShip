import React from 'react'
import './Loader.css'

export default function Loader({
                                   type = 'spinner',
                                   size = 'medium',
                                   text = 'Loading…',
                                   inline = false
                               }) {
    const className = [
        'loader',
        type,
        size,
        inline ? 'inline' : ''
    ].filter(Boolean).join(' ')

    if (type === 'dots') {
        return (
            <div className={className}>
                <span></span>
                {text}
            </div>
        )
    }

    if (type === 'skeleton') {
        return (
            <div className={className}>
                <div className="skeleton-text"></div>
                {text}
            </div>
        )
    }

    return <div className={className}>{text}</div>
}