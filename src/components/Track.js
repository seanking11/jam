import React, { useState, useRef, useEffect } from 'react'
import uuid from 'uuid/v4'
import firebase from 'firebase/app'
import styled from 'styled-components'

import { Clip } from './index'

const TrackPanel = styled.input`
    display: inline-block;
    height: 100px;
    background-color: darkgrey;
    ${'' /* display: flex;
    align-items: center;
    justify-content: center; */}
`

const TrackWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const Track = ({ id, addNewTrack }) => {
    const [track, setTrack] = useState({})
    // const [name, setName] = useState('')
    const input = useRef(null)
    useEffect(() => {
        const db = firebase.firestore()
        db.collection('tracks')
            .doc(id)
            .onSnapshot(function(doc) {
                setTrack(doc.data())
            })
    }, [id])

    const onNameChange = (name) => {
        const db = firebase.firestore()
        const trackRef = db.collection('tracks').doc(id)
        trackRef.update({
            name,
        })
    }

    const uploadFile = async (e) => {
        const clipId = uuid()
        const file = input.current.files[0]

        const storageRef = firebase.storage().ref()
        const clipRef = storageRef.child(`clips/${clipId}.mp4`)
        // Upload clip
        const uploadTask = await clipRef.put(file)
        const downloadURL = await uploadTask.ref.getDownloadURL()
        // Create clip document
        const db = firebase.firestore()
        await db
            .collection('clips')
            .doc(clipId)
            .set({
                url: downloadURL,
            })

        // Update track to include clip
        await db
            .collection('tracks')
            .doc(id)
            .update({ clips: firebase.firestore.FieldValue.arrayUnion(clipId) })
    }

    return (
        <TrackWrapper>
            <input
                type="text"
                placeholder="Track name"
                value={track?.name || ''}
                onChange={({ target: { value } }) => onNameChange(value)}
            />
            <div>
                {track?.clips?.length >= 1 ? (
                    <Clip id={track.clips[0]} />
                ) : (
                    <TrackPanel
                        ref={input}
                        onChange={uploadFile}
                        type="file"
                        accept="video/*"
                    />
                )}
            </div>
        </TrackWrapper>
    )
}

export default Track
