import React, { useRef } from 'react'
import uuid from 'uuid/v4'
import firebase from 'firebase/app'
import styled from 'styled-components'

import { Clip } from './index'

const TrackPanel = styled.input`
    display: inline-block;
    height: 100px;
    background-color: darkgrey;
    margin: 10px;
`

const Track = ({ songId, id, track, addNewTrack }) => {
    const videoInput = useRef(null)

    const onNameChange = (name) => {
        const db = firebase.firestore()
        const songRef = db.collection('songs').doc(songId)
        const trackNamePath = `tracks.${id}.name`
        songRef.update({
            [trackNamePath]: name,
        })
    }

    const uploadFile = async (e) => {
        const clipId = uuid()
        const file = videoInput.current.files[0]

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
        const songRef = db.collection('songs').doc(songId)
        const clipPath = `tracks.${id}.clips.${clipId}`
        await songRef.update({ [clipPath]: { url: downloadURL } })
    }

    const clips = track?.clips
    const clipIds = clips ? Object.keys(clips) : []

    return (
        <div className="my-4">
            <input
                className="text-grey bg-transparent my-4"
                type="text"
                placeholder="Track name"
                value={track?.name || ''}
                onChange={({ target: { value } }) => onNameChange(value)}
            />
            <div className="rounded bg-gray-800 ml-16">
                {clipIds.length > 0 ? (
                    <Clip id={clipIds[0]} />
                ) : (
                    <TrackPanel
                        ref={videoInput}
                        onChange={uploadFile}
                        type="file"
                        accept="video/*"
                    />
                )}
            </div>
        </div>
    )
}

export default Track
