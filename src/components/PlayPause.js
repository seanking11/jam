import React, { useState } from 'react'

const PlayPause = ({ onToggle = () => {}, className }) => {
    const [isPlaying, setPlaying] = useState(false)
    return (
        <div className={className}>
            {isPlaying ? (
                <span
                    role="img"
                    aria-label="X"
                    onClick={() => {
                        onToggle()
                        setPlaying(false)
                    }}
                >
                    ⏸️
                </span>
            ) : (
                <span
                    role="img"
                    aria-label="X"
                    onClick={() => {
                        onToggle()
                        setPlaying(true)
                    }}
                >
                    ▶️
                </span>
            )}
        </div>
    )
}

export default PlayPause
