import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import styled from 'styled-components'

const SongGrid = styled.div`
    display: grid;
    padding: 15px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 20px;
    align-items: stretch;
`

const SongItem = styled(Link)`
    text-decoration: none;
    padding: 1rem;
    border: 1px solid #777777;
    font-size: 18px;
    text-align: left;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2),
        0 4px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 5px;
    transition: 0.4s;
    cursor: pointer;

    :hover {
        transform: scale(0.9, 0.9);
    }
`

const SongList = ({ user = {} }) => {
    const userId = user?.firebaseUserUid
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
            tracks: {},
            createdBy: userId,
            userIds: [userId],
        })
        setNewSongName('')
    }

    const signOut = () => {
        firebase.auth().signOut()
    }

    const toggleTheme = () => {
        const themes = ['light', 'dark']
        const body = document.getElementById('body')
        const classList = body.classList
        if (classList.contains(themes[0])) {
            classList.remove(themes[0])
            classList.add(themes[1])
        } else {
            classList.remove(themes[1])
            classList.add(themes[0])
        }
    }

    // All songs associated to your userId will be fetched
    // Your songs are denoted by the createdBy
    const [yourSongs, sharedSongs] = _.partition(
        songs,
        (song) => song.createdBy === userId
    )
    console.log(yourSongs)
    return (
        <div className="mb-2">
            <div>
                <h2 className="text-3xl p-4 font-semibold">Your songs</h2>
                {yourSongs ? (
                    <div className="p-4 space-y-4">
                        {yourSongs.map((song) => (
                            <Link
                                key={song.name}
                                to={`songs/${song.id}`}
                                className="border rounded flex justify-between shadow-lg"
                            >
                                <div className="p-2 flex flex-col justify-between">
                                    <div>
                                        <div className="font-bold text-xl">
                                            {song.name}
                                        </div>
                                        <div className="font-semibold">
                                            {song.artist || 'Artist'}
                                        </div>
                                    </div>
                                    <div className="align-self-end">
                                        {song.length || '3:27'}
                                    </div>
                                </div>
                                <div className="">
                                    <img
                                        src={'https://picsum.photos/360/360'}
                                        className="w-36 h-36"
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div>
                        <span role="img" aria-label="Scream">
                            😱
                        </span>{' '}
                        You have no songs, add one below!
                    </div>
                )}

                <div className="flex">
                    <input
                        type="text"
                        placeholder="New song name"
                        value={newSongName}
                        onChange={({ target: { value } }) =>
                            setNewSongName(value)
                        }
                        className="bg-default focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 ml-4 block w-full appearance-none leading-normal"
                    />
                    <button
                        type="button"
                        onClick={addSong}
                        className="p-4 mr-4"
                    >
                        <span role="img" aria-label="Plus">
                            ➕
                        </span>{' '}
                    </button>
                </div>
            </div>

            <div>
                <h4 className="text-3xl p-4 font-semibold">
                    <span role="img" aria-label="Scream">
                        👬
                    </span>{' '}
                    Songs shared with you
                </h4>

                {sharedSongs ? (
                    <SongGrid>
                        {sharedSongs.map((song) => (
                            <SongItem
                                key={song.name}
                                to={`songs/${song.id}`}
                                style={{ display: 'block' }}
                            >
                                {song.name}
                            </SongItem>
                        ))}
                    </SongGrid>
                ) : (
                    <div>
                        None yet, use your ID below to have someone send you a
                        song
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={toggleTheme}
                className="float-left p-2"
            >
                <span role="img" aria-label="Rainbow">
                    🌈
                </span>{' '}
                Toggle theme
            </button>
            <button type="button" onClick={signOut} className="float-right p-2">
                <span role="img" aria-label="Wave">
                    👋
                </span>{' '}
                Sign Out
            </button>
        </div>
    )
}

export default SongList
