import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import firebase from 'firebase'
import uuid from 'uuid/v4'

const Container = styled.div`
    display: grid;
    ${'' /* grid-gap: 1em; */}
    ${'' /* grid-auto-rows: minmax(100px); */}
`

const Bottom = styled.div`
    background-color: lightgrey;
`

const Top = styled.div`
    background-color: grey;
`

const TrackPanel = styled.input`
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

    return <ClipVideo src={clip.url} controls />
}

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
            {track?.clips &&
                track.clips.map((clipId) => <Clip key={clipId} id={clipId} />)}
            <TrackPanel
                ref={input}
                onChange={uploadFile}
                type="file"
                accept="video/*"
            />
        </TrackWrapper>
    )
}

const Song = ({
    match: {
        params: { songId },
    },
}) => {
    const videoRef = useRef(null)
    const [song, setSong] = useState({})
    const [friendId, setFriendId] = useState('')

    useEffect(() => {
        if (songId) {
            const db = firebase.firestore()
            db.collection('songs')
                .doc(songId || '')
                .onSnapshot(function(doc) {
                    setSong(doc.data())
                })
        }
    }, [songId])

    const onSongNameChange = (name) => {
        const db = firebase.firestore()
        const songRef = db.collection('songs').doc(songId)
        songRef.update({ name })
    }

    const onShareWithFriend = async () => {
        const db = firebase.firestore()
        await db
            .collection('songs')
            .doc(songId)
            .update({
                userIds: firebase.firestore.FieldValue.arrayUnion(friendId),
            })
    }

    const addNewTrack = async () => {
        const db = firebase.firestore()
        const newTrack = await db
            .collection('tracks')
            .add({ name: 'Track name' })

        const songRef = db.collection('songs').doc(songId)
        const existingTracks = song.tracks
        await songRef.update({
            tracks: [...existingTracks, newTrack.id],
        })
    }

    return (
        <Container>
            <Top>
                <input
                    type="text"
                    placeholder="Song title"
                    value={song?.name || ''}
                    onChange={({ target: { value } }) =>
                        onSongNameChange(value)
                    }
                />

                <input
                    type="text"
                    placeholder="Friend's user ID"
                    value={friendId}
                    onChange={({ target: { value } }) => setFriendId(value)}
                />
                <button onClick={onShareWithFriend}>Share with friend</button>
                {/* <video id="video" ref={videoRef} controls /> */}
            </Top>

            <Bottom>
                {song?.tracks?.length > 0 ? (
                    song.tracks.map((trackId) => (
                        <Track key={trackId} id={trackId} />
                    ))
                ) : (
                    <div>
                        <span role="img" aria-label="X">
                            ❌
                        </span>{' '}
                        No tracks in this song, add one!
                    </div>
                )}

                <div onClick={addNewTrack}>
                    <span role="img" aria-label="Plus">
                        ➕
                    </span>{' '}
                    Add new track
                </div>
            </Bottom>
        </Container>
    )
}

export default Song
