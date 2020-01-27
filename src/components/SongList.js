import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { Link } from 'react-router-dom'

const SongList = ({ user = {} }) => {
    const userId = user?.uid
    const [songs, setSongs] = useState([])
    const [newSongName, setNewSongName] = useState('')

    useEffect(() => {
        if (userId) {
            const db = firebase.firestore()
            db.collection('songs')
                .where('userId', '==', userId)
                .onSnapshot((qs) => {
                    console.log(qs)
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
            userId,
        })
        setNewSongName('')
    }

    return (
        <div>
            {songs ? (
                songs.map((song) => (
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
    )
}

export default SongList
