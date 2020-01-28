import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import firebase from 'firebase'
import uuid from 'uuid/v4'
import PlayPause from './PlayPause'

const Container = styled.div`
    display: grid;
    grid-template-columns
    ${'' /* grid-gap: 1em; */}
    ${'' /* grid-auto-rows: minmax(100px); */}
`

const Bottom = styled.div`
    background-color: lightgrey;
`

const Top = styled.div`
    height: 200px;

    div {
        text-align: center;
    }
`

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

const ClipVideo = styled.video`
    width: 150px;
    height: 75px;
`

const Clip = ({ id, videoRef, ...rest }) => {
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

    return <ClipVideo src={clip.url} controls ref={videoRef} {...rest} />
}

const Track = ({ id, onAddNewTracks, videoRef }) => {
    const [track, setTrack] = useState({})
    // const [name, setName] = useState('')
    const input = useRef(null)

    const videoRefs = useRef(track?.clips?.map(React.createRef))
    console.log(videoRefs)

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

    const onTogglePausePlay = () => {
        for (const videoRef in videoRefs) {
            console.log('videoRef', videoRef)
            videoRef.play()
        }
    }

    const clipId = track?.clips && track?.clips[0]
    return (
        <TrackWrapper>
            <input
                type="text"
                placeholder="Track name"
                value={track?.name || ''}
                onChange={({ target: { value } }) => onNameChange(value)}
            />
            <PlayPause onToggle={onTogglePausePlay} />
            <div>
                {track?.clips &&
                    track.clips.map((clipId, index) => (
                        <Clip
                            key={clipId}
                            id={clipId}
                            videoRef={videoRefs[index]}
                        />
                    ))}

                <TrackPanel
                    ref={input}
                    onChange={uploadFile}
                    type="file"
                    accept="video/*"
                />
            </div>
        </TrackWrapper>
    )
}

const Song = ({
    match: {
        params: { songId },
    },
}) => {
    const [song, setSong] = useState({})
    const [friendId, setFriendId] = useState('')
    // const videoRefs = useRef(song?.tracks?.map(React.createRef))
    // console.log(videoRefs)
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
        setFriendId('')
    }

    const onAddNewTracks = async () => {
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

    // const onTogglePausePlay = () => {
    //     console.log('clicked')
    //     for (const videoRef in videoRefs) {
    //         videoRef.play()
    //     }
    // }

    return (
        <Container>
            <Top>
                <div>
                    <input
                        type="text"
                        placeholder="Song title"
                        value={song?.name || ''}
                        onChange={({ target: { value } }) =>
                            onSongNameChange(value)
                        }
                    />
                </div>

                <input
                    type="text"
                    placeholder="Friend's user ID"
                    value={friendId}
                    onChange={({ target: { value } }) => setFriendId(value)}
                />
                <button onClick={onShareWithFriend}>Share with friend</button>
                {/* <video id="video" ref={videoRef} controls /> */}
                {/* <PlayPause onToggle={onTogglePausePlay} /> */}
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

                <hr />
                <div onClick={onAddNewTracks}>
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
