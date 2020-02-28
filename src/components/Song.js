import _ from 'lodash'
import React, { useState, createRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import VideoRecorder from 'react-video-recorder'
import uuid from 'uuid/v4'

import { Track, PlayPause, VideoGrid } from './index'

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
        onPause()
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
        <div className="videoGrid bg-gray-900 text-gray-100">
            <div className="p-4 flex flex-row justify-between">
                <Link to="/songs">Back</Link>

                <input
                    className="bg-transparent text-center outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Song title"
                    value={song?.name || ''}
                    onChange={({ target: { value } }) =>
                        onSongNameChange(value)
                    }
                />

                <div className="inline">
                    <input
                        type="text"
                        placeholder="Friend's user ID"
                        value={friendId}
                        onChange={({ target: { value } }) => setFriendId(value)}
                    />
                    <button onClick={onShareWithFriend}>Share</button>
                </div>
            </div>

            <div className="grid grid-cols-2 border-b border-gray-800">
                {videoRefs && (
                    <VideoGrid>
                        {videoRefs.map((ref, i) => (
                            <div className="videoGridItem">
                                <div className="videoWrapper" key={i}>
                                    <video
                                        className="centeredVideo"
                                        key={clipUrls[i]}
                                        ref={videoRefs[i]}
                                        src={clipUrls[i]}
                                        type="video/mp4"
                                    />
                                </div>
                            </div>
                        ))}
                    </VideoGrid>
                )}

                {showRecorder && (
                    <VideoRecorder
                        onRecordingComplete={onRecordingComplete}
                        onStartRecording={playWithDelay}
                        countdownTime={COUNTDOWN_DELAY_MS}
                    />
                )}
            </div>

            <div className="tracksContainer gap-4 overflow-scroll scrolling-touch">
                <div className="p-4 flex flex-row">
                    <PlayPause onToggle={onTogglePlayPause} />

                    <label className="ml-2" htmlFor="showRecorder">
                        Show Recorder
                    </label>
                    <input
                        id="showRecorder"
                        type="checkbox"
                        onClick={() => setShowRecorder(!showRecorder)}
                        defaultChecked
                        label="Show recorder"
                        className="ml-2"
                    />
                </div>

                <div className="p-2 flex justify-between">
                    <span>00:00</span>
                    <span className="mr-4">00:30</span>
                </div>

                {trackIds.length > 0 &&
                    trackIds.map((trackId) => (
                        <Track
                            key={trackId}
                            id={trackId}
                            track={tracks[trackId]}
                            songId={songId}
                        />
                    ))}

                {/* Intentionally empty to place the button below in the right spot */}
                <div></div>
                <div
                    onClick={addNewTrack}
                    className="bg-gray-800 h-12 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer center"
                >
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
