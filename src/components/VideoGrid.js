import React from 'react'

const VideoGrid = ({ children }) => {
    const classNamesMap = {
        1: 'grid-cols-1',
        2: 'grid-rows-2 xl:grid-rows-none xl:grid-cols-2',
        3: 'grid-cols-2 grid-rows-2 lg:grid-cols-3 lg:grid-rows-none',
        4: 'grid-cols-2 grid-rows-2',
        5: 'grid-cols-2 grid-rows-3 lg:grid-cols-3 lg:grid-rows-2',
        6: 'grid-cols-2 grid-rows-3 lg:grid-cols-3 lg:grid-rows-2',
        7: 'grid-cols-3 grid-rows-3',
        8: 'grid-cols-3 grid-rows-3',
    }

    return (
        <div id="videos" className={`grid ${classNamesMap[children.length]}`}>
            {children}
        </div>
    )
}

export default VideoGrid
