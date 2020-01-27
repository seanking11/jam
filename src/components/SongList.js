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
    color: #777777;
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

const NewSongForm = styled.div`
    display: flex;
    margin: 15px;
    ${'' /* border: 1px solid #777777; */}
    font-size: 18px;
    color: #777777;
    text-align: left;

    input {
        border: none;
        border-bottom: 1px solid;
        flex-grow: 2;
        border-radius: none;
        font-size: 16px;
    }

    button {
        flex-grow: 1;
    }
`

const Title = styled.h4`
    text-align: left
    margin-left: 5px
`

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
                <Title>
                    <span role="img" aria-label="Music note">
                        🎵
                    </span>{' '}
                    Your songs
                </Title>
                {yourSongs ? (
                    <SongGrid>
                        {yourSongs.map((song) => (
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
                        <span role="img" aria-label="Scream">
                            😱
                        </span>{' '}
                        You have no songs, add one below!
                    </div>
                )}

                <NewSongForm>
                    <input
                        type="text"
                        placeholder="New song name"
                        value={newSongName}
                        onChange={({ target: { value } }) =>
                            setNewSongName(value)
                        }
                    />
                    <button type="button" onClick={addSong}>
                        <span role="img" aria-label="Plus">
                            ➕
                        </span>{' '}
                    </button>
                </NewSongForm>
            </div>

            <div>
                <Title>
                    <span role="img" aria-label="Scream">
                        👬
                    </span>{' '}
                    Songs shared with you
                </Title>

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
                <div>
                    Your user ID{' '}
                    <code style={{ fontSize: '8px' }}>{user.uid}</code>{' '}
                </div>
            </div>
        </div>
    )
}

export default SongList
