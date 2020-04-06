import _ from 'lodash'
import React, { useState, createRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import VideoRecorder from 'react-video-recorder'
import uuid from 'uuid/v4'
import {
    faChevronLeft,
    faChevronDown,
    faChevronUp,
} from '@fortawesome/free-solid-svg-icons'
import {
    faPauseCircle,
    faPlayCircle,
} from '@fortawesome/free-regular-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Track, ToggleButton, VideoGrid } from './index'
import Player from './Player'

const COUNTDOWN_DELAY_MS = 3000

const Song = ({
    match: {
        params: { songId },
    },
}) => {
    const [song, setSong] = useState({})
    const [friendId, setFriendId] = useState('')
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [player, setPlayer] = useState(null)
    const [clips, setClips] = useState([])
    const [editable, setEditable] = useState(false)

    useEffect(() => {
        let unsub
        const getSongData = async () => {
            const db = firebase.firestore()
            unsub = db
                .collection('songs')
                .doc(songId || '')
                .onSnapshot(function(doc) {
                    const song = doc.data()
                    setSong(song)
                    if (song?.privacySetting === 'public') {
                        setEditable(true)
                    }
                })

            // TODO: Unsubscribe from this
            db.collection('songs')
                .doc(songId)
                .collection('clips')
                .onSnapshot((snapshot) => {
                    let newClips = clips
                    snapshot.docChanges().forEach((change) => {
                        const clip = {
                            clipId: change.doc.id,
                            ...change.doc.data(),
                        }

                        const clipIndexToOverride = newClips.findIndex(
                            (clip) => clip.clipId === change.doc.id
                        )
                        if (clipIndexToOverride === -1) {
                            newClips.push(clip)
                        } else {
                            newClips[clipIndexToOverride] = clip
                        }
                    })

                    setClips(newClips)

                    _.each(clips, (clip) => {
                        const ref = createRef()
                        clip.videoRef = ref
                    })

                    const player = new Player({
                        clips,
                        incrementSeconds: setCurrentTime,
                    })
                    setPlayer(player)
                })
        }

        if (songId) {
            getSongData()
        }

        return unsub
    }, [clips, songId])

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
                name: '',
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
        const uploadTask = await clipRef.put(videoBlob, {
            contentType: 'video/mp4',
        })
        const downloadURL = await uploadTask.ref.getDownloadURL()

        const db = firebase.firestore()
        const trackId = await addNewTrack()
        const clipsRef = db
            .collection('songs')
            .doc(songId)
            .collection('clips')

        await clipsRef.add({ trackId, url: downloadURL, startAt: '00:00' })
    }

    const onPause = useCallback(() => {
        setIsPlaying(false)
        player.pause()
    }, [player])

    const onPlay = useCallback(() => {
        setIsPlaying(true)
        player.play()
    }, [player])

    const onSeek = useCallback(
        (seekToTime = 0) => {
            player.seek(seekToTime)
        },
        [player]
    )

    const onTogglePlayPause = useCallback(() => {
        if (isPlaying) {
            onPause()
        } else {
            onPlay()
        }
    }, [onPause, onPlay, isPlaying])

    const playWithDelay = useCallback(() => {
        onSeek(0)
        setTimeout(() => {
            onPlay()
        }, COUNTDOWN_DELAY_MS)
    }, [onPlay, onSeek])

    const onToggleFullscreen = () => {
        const className = 'fullscreen'
        const classList = document.getElementById('videoGrid').classList

        if (classList.contains(className)) {
            classList.remove(className)
        } else {
            classList.add(className)
        }
    }

    return (
        <div className="screen bg-default-soft text-default">
            <div id="videoGrid" className="grid grid-cols-2">
                {clips && (
                    <VideoGrid>
                        {_.map(clips, (clip, i) => (
                            <div className="videoGridItem" key={i}>
                                <div className="videoWrapper">
                                    <video
                                        className="centeredVideo"
                                        key={clip.id}
                                        ref={clip.videoRef}
                                        src={clip.url}
                                        type="video/mp4"
                                        playsInline
                                    />
                                </div>
                            </div>
                        ))}
                    </VideoGrid>
                )}

                {editable && (
                    <VideoRecorder
                        onRecordingComplete={onRecordingComplete}
                        onStartRecording={playWithDelay}
                        countdownTime={COUNTDOWN_DELAY_MS}
                    />
                )}
            </div>

            <div>
                <div className="p-4 flex items-center bg-default">
                    <div className="navItem" style={{ marginRight: 'auto' }}>
                        <Link to="/songs">
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </Link>

                        <input
                            className="bg-default ml-4 outline-none focus:shadow-outline"
                            type="text"
                            placeholder="Song title"
                            value={song?.name || ''}
                            onChange={({ target: { value } }) =>
                                onSongNameChange(value)
                            }
                            disabled={!editable}
                        />
                    </div>

                    <ToggleButton
                        id="pausePlay"
                        onToggle={onTogglePlayPause}
                        iconA={faPlayCircle}
                        iconB={faPauseCircle}
                        size="2x"
                        className="navItem justify-center flex"
                    />

                    <ToggleButton
                        className="navItem justify-end"
                        iconA={faChevronDown}
                        iconB={faChevronUp}
                        id="fullscreenToggle"
                        onToggle={onToggleFullscreen}
                        size="lg"
                        style={{ marginLeft: 'auto' }}
                    />
                </div>

                <div className="overflow-scroll relative">
                    <div className="tracksContainer gap-4">
                        <div className="p-4 flex flex-row">
                            {/* <label className="ml-2" htmlFor="showRecorder">
                        Show Recorder
                    </label>
                    <input
                        id="showRecorder"
                        type="checkbox"
                        onClick={() => setShowRecorder(!showRecorder)}
                        defaultChecked
                        label="Show recorder"
                        className="ml-2"
                    /> */}

                            <div className="inline">
                                <input
                                    type="text"
                                    className="bg-default-soft"
                                    placeholder="Friend's user ID"
                                    value={friendId}
                                    onChange={({ target: { value } }) =>
                                        setFriendId(value)
                                    }
                                    disabled={!editable}
                                />
                                <button
                                    className="bg-primary rounded-lg p-2"
                                    onClick={onShareWithFriend}
                                    disabled={!editable}
                                >
                                    Share
                                </button>
                            </div>
                        </div>

                        <div className="p-2 flex justify-between">
                            <div id="controls" className="relative">
                                <div
                                    className="absolute"
                                    style={{ left: `${currentTime}px` }}
                                >
                                    \/
                                </div>
                            </div>
                            <span>{player?.time || '00:00'}</span>
                        </div>

                        {song?.tracks &&
                            _.map(song?.tracks, (track, trackId) => {
                                const clipsForTrack = clips?.filter(
                                    (clip) => clip.trackId === trackId
                                )
                                return (
                                    <Track
                                        key={trackId}
                                        id={trackId}
                                        track={track}
                                        clips={clipsForTrack}
                                        songId={songId}
                                        editable={editable}
                                    />
                                )
                            })}

                        {/* Intentionally empty to place the button below in the right spot */}
                        <div></div>
                        <button
                            onClick={addNewTrack}
                            className="bg-gray-800 h-12 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer center"
                            disabled={!editable}
                        >
                            <span role="img" aria-label="Plus">
                                ➕
                            </span>{' '}
                            Add new track
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Song
