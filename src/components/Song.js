import _ from 'lodash'
import React, { useState, createRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import VideoRecorder from 'react-video-recorder'
import uuid from 'uuid/v4'

import { Track, PlayPause } from './index'

const COUNTDOWN_DELAY_MS = 3000

const Song = ({
    match: {
        params: { songId },
    },
}) => {
    const [song, setSong] = useState({})
    const [friendId, setFriendId] = useState('')
    const [isPlaying, setIsPlaying] = useState(false)
    const [videoRefs, setVideoRefs] = useState()
    const [showRecorder, setShowRecorder] = useState(true)
    const [clipUrls, setClipUrls] = useState([])

    useEffect(() => {
        if (songId) {
            const db = firebase.firestore()
            db.collection('songs')
                .doc(songId || '')
                .onSnapshot(function(doc) {
                    const song = doc.data()
                    setSong(song)

                    const tracks = song?.tracks
                    const trackIds = _.keys(tracks)

                    const clipUrls = trackIds
                        .map((trackId) => {
                            if (tracks[trackId].clips) {
                                const clipIds = Object.keys(
                                    tracks[trackId].clips
                                )
                                return tracks[trackId].clips[clipIds[0]].url
                            }

                            return ''
                        })
                        .filter((clip) => clip !== '')
                    setClipUrls(clipUrls)

                    const videoRefs = clipUrls.map((url) => createRef())
                    setVideoRefs(videoRefs)
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
        const trackId = uuid()

        const songRef = db.collection('songs').doc(songId)
        const trackPath = `tracks.${trackId}`

        await songRef.update({
            [trackPath]: {
                name: 'Track Name',
            },
        })

        return trackId
    }

    const onRecordingComplete = async (videoBlob) => {
        // Pause the video and hide the recorder
        onPause()
        setShowRecorder(false)
        const clipId = uuid()

        const storageRef = firebase.storage().ref()
        const clipRef = storageRef.child(`clips/${clipId}.mp4`)
        // Upload clip
        const uploadTask = await clipRef.put(videoBlob)
        const downloadURL = await uploadTask.ref.getDownloadURL()
        // Create clip document
        const db = firebase.firestore()
        await db
            .collection('clips')
            .doc(clipId)
            .set({
                url: downloadURL,
            })

        // Create new track
        const trackId = await addNewTrack()

        // Update track to include clip
        const songRef = db.collection('songs').doc(songId)
        const clipPath = `tracks.${trackId}.clips.${clipId}`
        await songRef.update({ [clipPath]: { url: downloadURL } })
    }

    const onPause = useCallback(() => {
        _.each(videoRefs, (ref) => {
            ref.current.pause()
        })

        setIsPlaying(false)
    }, [videoRefs])

    const onPlay = useCallback(() => {
        _.each(videoRefs, (ref) => {
            ref.current.play()
        })

        setIsPlaying(true)
    }, [videoRefs])

    const onTogglePlayPause = useCallback(() => {
        if (isPlaying) {
            onPause()
        } else {
            onPlay()
        }
    }, [onPause, onPlay, isPlaying])

    const playWithDelay = useCallback(() => {
        setTimeout(() => {
            onPlay()
        }, COUNTDOWN_DELAY_MS)
    }, [onPlay])

    const tracks = song?.tracks
    const trackIds = tracks ? Object.keys(tracks) : []

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
                <div className="border grid grid-cols-1 md:grid-cols-2 max-h-1/2">
                    {videoRefs &&
                        videoRefs.map((ref, i) => (
                            <div key={i}>
                                <video
                                    key={clipUrls[i]}
                                    src={clipUrls[i]}
                                    ref={videoRefs[i]}
                                ></video>
                            </div>
                        ))}

                    {showRecorder && (
                        <VideoRecorder
                            onRecordingComplete={onRecordingComplete}
                            onStartRecording={playWithDelay}
                            countdownTime={COUNTDOWN_DELAY_MS}
                        />
                    )}
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

            <div className="p-4 bg-gray-100 text-black">
                <PlayPause onToggle={onTogglePlayPause} />
                <label htmlFor="showRecorder">Show Recorder</label>

                <input
                    id="showRecorder"
                    type="checkbox"
                    onClick={() => setShowRecorder(!showRecorder)}
                    defaultChecked
                    label="Show recorder"
                />
                {trackIds.length > 0 ? (
                    trackIds.map((trackId) => (
                        <Track
                            key={trackId}
                            id={trackId}
                            track={tracks[trackId]}
                            songId={songId}
                        />
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
            </div>
        </div>
    )
}

export default Song
