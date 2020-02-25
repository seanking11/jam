import React from 'react'

const VideoGrid = () => {
    return (
        <div className="videoGrid">
            <div className="bg-red-400">Nav</div>
            <div className="bg-blue-200 grid grid-cols-1 sm:grid-cols-2">
                {/* <div className="bg-blue-200 flex flex-row sm:flex-column"> */}
                <div className="bg-blue-400">Video</div>
                <div className="bg-orange-400">Friends</div>
            </div>
            <div className="bg-purple-400">Play pause</div>
            <div className="bg-yellow-400">Tracks</div>
        </div>
    )
}

export default VideoGrid
