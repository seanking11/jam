import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import firebase from 'firebase'

import { Track } from './index'
import PlayPause from './PlayPause'

const Container = styled.div`
    display: grid;
    grid-template-columns
`
const Bottom = styled.div`
    background-color: lightgrey;
    height: 80vh;
    padding: 15px;

    div {
        margin-top: 10px;
        margin-bottom: 10px;
    }
`

const Top = styled.div`
    height: 20vh;
    display: flex;
    flex-direction: row;

    div {
        text-align: center;
        flex: 1;
        border: 1px solid #eee;
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
        <div className="h-screen w-screen">
            <div className="p-4 text-center border ">
                <Link to="/songs" className="float-left">
                    Back
                </Link>
                <input
                    className="border-b"
                    type="text"
                    placeholder="Song title"
                    value={song?.name || ''}
                    onChange={({ target: { value } }) =>
                        onSongNameChange(value)
                    }
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="border grid grid-flow-col">
                    <video
                        // className="w-screen h-auto"
                        controls
                        src="https://firebasestorage.googleapis.com/v0/b/jams-b177f.appspot.com/o/clips%2F7eae593a-29fd-4d9f-b89e-8075ec4aa2b0.mp4?alt=media&token=f404210b-4490-404c-8cf7-5e6361a95ecb"
                    ></video>
                    <video
                        // className="w-screen h-auto"
                        controls
                        src="https://firebasestorage.googleapis.com/v0/b/jams-b177f.appspot.com/o/clips%2F7eae593a-29fd-4d9f-b89e-8075ec4aa2b0.mp4?alt=media&token=f404210b-4490-404c-8cf7-5e6361a95ecb"
                    ></video>
                </div>

                <div className="border">
                    <input
                        type="text"
                        placeholder="Friend's user ID"
                        value={friendId}
                        onChange={({ target: { value } }) => setFriendId(value)}
                    />
                    <button onClick={onShareWithFriend}>
                        Share with friend
                    </button>
                </div>
            </div>

            <div className="fp-4">
                <PlayPause onToggle={onToggle} />
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
            </div>
        </div>
    )
}

export default Song
