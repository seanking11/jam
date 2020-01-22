import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'

const JamList = ({ user }) => {
    const [songs, setSongs] = useState([])
    const [newSongName, setNewSongName] = useState([])

    useEffect(() => {
        // get the songs
        const fetchData = () => {
            const db = firebase.firestore()
            db.collection('songs')
                .where('userId', '==', user.uid)
                .onSnapshot((qs) => {
                    console.log(qs)
                    let songArr = []
                    qs.forEach((doc) => songArr.push(doc.data()))
                    setSongs(songArr)
                })
        }
        fetchData()
    }, [user.uid])

    const addSong = async () => {
        const db = firebase.firestore()
        db.collection('songs').add({
            name: newSongName,
            userId: user.uid,
        })
    }

    return (
        <div>
            {songs.map((song) => (
                <div key={song.name}>{song.name}</div>
            ))}
            <hr />
            <input
                type="text"
                placeholder="New song name"
                onChange={({ target: { value } }) => setNewSongName(value)}
            />
            <button type="button" onClick={addSong}>
                Add new song
            </button>
        </div>
    )
}

export default JamList
