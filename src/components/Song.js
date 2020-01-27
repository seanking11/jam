import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import firebase from 'firebase'

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

    return (
        <TrackWrapper>
            <input
                type="text"
                placeholder="Track name"
                value={track?.name || ''}
                onChange={({ target: { value } }) => onNameChange(value)}
            />
            <TrackPanel
                ref={input}
                onChange={addNewTrack}
                type="file"
                accept="video/*"
            />
        </TrackWrapper>
    )
}

const Song = ({ match }) => {
    const videoRef = useRef(null)
    const input = useRef(null)
    const [song, setSong] = useState({})

    useEffect(() => {
        if (match.params.songId) {
            const db = firebase.firestore()
            db.collection('songs')
                .doc(match.params.songId || '')
                .onSnapshot(function(doc) {
                    setSong(doc.data())
                })
        }
    }, [match.params.songId])

    const uploadFile = (e) => {
        const file = input.current.files[0]
        const objUrl = window.URL.createObjectURL(file)
        videoRef.current.src = objUrl

        // Upload to firebase
        const storageRef = firebase.storage().ref()
        const clipRef = storageRef.child('clip.mp4')
        clipRef.put(file).then(function(snapshot) {
            console.log('Uploaded a blob or file!', snapshot)
        })
    }

    const addNewTrack = async () => {
        const db = firebase.firestore()
        const newTrack = await db
            .collection('tracks')
            .add({ name: 'Track name' })

        const songId = match.params.songId

        const songRef = db.collection('songs').doc(songId)
        const existingTracks = song.tracks
        await songRef.update({
            tracks: [...existingTracks, newTrack.id],
        })
    }

    return (
        <Container>
            <Top>
                <input type="text" placeholder="Song title" />
                <video id="video" ref={videoRef} controls />
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
