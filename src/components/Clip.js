import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import firebase from 'firebase/app'

const ClipVideo = styled.video`
    width: 150px;
    height: 100%;
    position: absolute;
    ${'' /* left: ${({ startAt }) => `${startAt}px`}; */}
`

const Clip = React.forwardRef(({ clipId }, ref) => {
    const [clipUrl, setClipUrl] = useState()
    const [clipMetadata, setClipMetadata] = useState()
    useEffect(() => {
        const getDownloadURL = async () => {
            const storage = firebase.storage()
            const clipUrl = await storage
                .ref(`clips/${clipId}.mp4`)
                .getDownloadURL()

            const clipMetadata = await storage
                .ref(`clips/${clipId}.mp4`)
                .getMetadata()

            setClipUrl(clipUrl)
            setClipMetadata(clipMetadata)
        }
        if (clipId) {
            getDownloadURL()
        }
    }, [clipId])

    console.log(clipUrl)
    console.log(clipMetadata)
    const type = clipMetadata?.contentType
    return (
        <video
            ref={ref}
            className="centeredVideo"
            type={'video/webm'}
            controls
            src={clipUrl}
            playsinline
        ></video>
    )
})

export default Clip
