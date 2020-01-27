import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { Link } from 'react-router-dom'
import _ from 'lodash'

const SongList = ({ user = {} }) => {
    const userId = user?.uid
    const [songs, setSongs] = useState([])
    const [newSongName, setNewSongName] = useState('')

    useEffect(() => {
        if (userId) {
            const db = firebase.firestore()
            db.collection('songs')
                .where('userIds', 'array-contains', userId)
                .onSnapshot((qs) => {
                    let songArr = []
                    qs.forEach((doc) => {
                        songArr.push({
                            id: doc.id,
                            ...doc.data(),
                        })
                    })
                    setSongs(songArr)
                })
        }
    }, [userId])

    const addSong = async () => {
        const db = firebase.firestore()
        await db.collection('songs').add({
            name: newSongName,
            tracks: [],
            createdBy: userId,
            userIds: [userId],
        })
        setNewSongName('')
    }

    // All songs associated to your userId will be fetched
    // Your songs are denoted by the createdBy
    const [yourSongs, sharedSongs] = _.partition(
        songs,
        (song) => song.createdBy === userId
    )

    return (
        <div>
            <div>
                <h4>Your songs</h4>
                {yourSongs ? (
                    yourSongs.map((song) => (
                        <Link
                            key={song.name}
                            to={`songs/${song.id}`}
                            style={{ display: 'block' }}
                        >
                            <span role="img" aria-label="Music note">
                                🎵
                            </span>{' '}
                            {song.name}
                        </Link>
                    ))
                ) : (
                    <div>
                        <span role="img" aria-label="Scream">
                            😱
                        </span>{' '}
                        You have no songs, add one below!
                    </div>
                )}

                <hr />
                <input
                    type="text"
                    placeholder="New song name"
                    value={newSongName}
                    onChange={({ target: { value } }) => setNewSongName(value)}
                />
                <button type="button" onClick={addSong}>
                    <span role="img" aria-label="Plus">
                        ➕
                    </span>{' '}
                    Add new song
                </button>
            </div>
            <div>
                <h4>Songs shared with you</h4>

                {sharedSongs &&
                    sharedSongs.map((song) => (
                        <Link
                            key={song.name}
                            to={`songs/${song.id}`}
                            style={{ display: 'block' }}
                        >
                            <span role="img" aria-label="Music note">
                                🎵
                            </span>{' '}
                            {song.name}
                        </Link>
                    ))}

                <div>
                    Your user ID <code>{user.uid}</code>
                </div>
            </div>
        </div>
    )
}

export default SongList
