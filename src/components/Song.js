import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import firebase from 'firebase'

import { Track } from './index'
import PlayPause from './PlayPause'

const Container = styled.div`
    display: grid;
    grid-template-columns
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

const Song = ({
    match: {
        params: { songId },
    },
}) => {
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
        setFriendId('')
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

    const onToggle = () => {
        // videoRef1.current.play()
        // videoRef2.current.play()
    }

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

                <PlayPause onToggle={onToggle} />
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
