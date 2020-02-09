import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import firebase from 'firebase/app'

const ClipVideo = styled.video`
    width: 150px;
    height: 75px;
`

const Clip = ({ id }) => {
    const [clip, setClip] = useState()
    useEffect(() => {
        if (id) {
            const db = firebase.firestore()
            db.collection('clips')
                .doc(id)
                .onSnapshot(function(doc) {
                    setClip({
                        id,
                        ...doc.data(),
                    })
                })
        }
    }, [id])

    if (!clip) return <div>...</div>

    return <ClipVideo src={clip.url} />
}

export default Clip
