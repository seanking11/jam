import React, { useRef } from 'react'
import uuid from 'uuid/v4'
import firebase from 'firebase/app'
import styled from 'styled-components'

import { Clip } from './index'

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

    const onDeleteTrack = async () => {
        const shouldDelete = window.confirm(
            'Delete this track? You cannot undo this.'
        )

        if (shouldDelete) {
            const db = firebase.firestore()
            const songRef = db.collection('songs').doc(songId)
            await songRef.update({
                [`tracks.${id}`]: firebase.firestore.FieldValue.delete(),
            })
        }
    }

    const clips = track?.clips
    const clipIds = clips ? Object.keys(clips) : []

    return (
        <>
            <div className="p-2 inline">
                <input
                    className="text-grey bg-transparent"
                    type="text"
                    placeholder="Track name"
                    value={track?.name || ''}
                    onChange={({ target: { value } }) => onNameChange(value)}
                />
                <span
                    role="img"
                    aria-label="Trash"
                    onClick={onDeleteTrack}
                    className="cursor-pointer"
                >
                    🗑️
                </span>
            </div>
            <div
                className="relative rounded-md bg-gray-800 border-dashed border-gray-900 border-2"
                style={{ height: '100px' }}
            >
                {clipIds.length > 0 ? (
                    <Clip clip={clips[clipIds[0]]} />
                ) : (
                    <div className="inline">
                        <input
                            ref={videoInput}
                            onChange={uploadFile}
                            type="file"
                            accept="video/*"
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default Track
