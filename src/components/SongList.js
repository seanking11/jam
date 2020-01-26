import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { Link } from 'react-router-dom'

const SongList = ({ user = {} }) => {
    const userId = user.uid || ''
    const [songs, setSongs] = useState([])
    const [newSongName, setNewSongName] = useState('')

    useEffect(() => {
        // get the songs
        const fetchData = () => {
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
        fetchData()
    }, [userId])

    const addSong = async () => {
        const db = firebase.firestore()
        const song = await db.collection('songs').add({
            name: newSongName,
            tracks: [],
            userId,
        })
        console.log(song)
        setNewSongName('')
    }

    return (
        <div>
            {songs.map((song) => (
                <Link
                    key={song.name}
                    to={`songs/${song.id}`}
                    style={{ display: 'block' }}
                >
                    {song.name}
                </Link>
            ))}
            <hr />
            <input
                type="text"
                placeholder="New song name"
                value={newSongName}
                onChange={({ target: { value } }) => setNewSongName(value)}
            />
            <button type="button" onClick={addSong}>
                Add new song
            </button>
        </div>
    )
}

export default SongList
