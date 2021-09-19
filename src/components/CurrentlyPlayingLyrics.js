import React, { useState, useEffect } from 'react'

import cloudFunctions from '../api/cloudFunctions'
import msToHumanReadable from '../util/msToHumanReadable'
import SpotifyApi from '../api/spotify'

export default ({ user }) => {
    const [lyrics, setLyrics] = useState('')
    const [progressMs, setProgressMs] = useState(0)

    const [songResponse, setSongResponse] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        if (user?.spotifyUser?.accessToken && user?.spotifyUser?.refreshToken) {
            SpotifyApi.setAccessToken(
                user?.spotifyUser?.accessToken,
                user?.spotifyUser?.refreshToken
            )
        }

        const interval = setInterval(async () => {
            const currentlyPlayingResponse = await SpotifyApi.getCurrentlyPlaying()

            if (currentlyPlayingResponse) {
                setProgressMs(currentlyPlayingResponse?.progress_ms)
                setIsPlaying(currentlyPlayingResponse.is_playing)

                // Song Changed
                if (
                    currentlyPlayingResponse?.item?.id !==
                    songResponse?.item?.id
                ) {
                    const song = currentlyPlayingResponse?.item
                    const title = song?.name
                    const artist = song?.artists[0]?.name
                    setSongResponse(currentlyPlayingResponse)
                    setLyrics('')

                    const lyricsResponse = await cloudFunctions.getLyricsForSong(
                        {
                            title,
                            artist,
                        }
                    )

                    setLyrics(lyricsResponse)
                }
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [songResponse, progressMs, user])

    if (!songResponse) {
        return <div>Loading ...</div>
    }

    const songTitle = songResponse?.item?.name
    const artistName = songResponse?.item?.artists[0].name
    const albumArtUrl = songResponse?.item?.album?.images[0]?.url

    const formattedLyrics = lyrics.split('\n').map((i) => {
        // Multiple \n characters in a row will need a <br>
        if (i === '') {
            return <br />
        }

        return <p>{i}</p>
    })

    const togglePlay = async function() {
        try {
            if (isPlaying) {
                setIsPlaying(false)
                await SpotifyApi.pause()
            } else {
                setIsPlaying(true)
                await SpotifyApi.play()
            }
        } catch (e) {
            console.log('error toggling playback', e)
        }
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="m-auto overflow-scroll p-4">
                {lyrics && formattedLyrics}
            </div>
            <Player
                songTitle={songTitle}
                artistName={artistName}
                imageUrl={albumArtUrl}
                durationMs={songResponse?.item?.duration_ms}
                progressMs={progressMs}
                isPlaying={isPlaying}
                togglePlay={togglePlay}
            />
        </div>
    )
}

const Player = ({
    songTitle,
    artistName,
    imageUrl,
    durationMs,
    progressMs,
    togglePlay,
    isPlaying,
}) => {
    const durationTime = msToHumanReadable(durationMs)
    const progressTime = msToHumanReadable(progressMs)
    const progressBarWidthPct = Math.floor((progressMs / durationMs) * 100)

    return (
        <div>
            <div className="bg-default-soft rounded-tl-xl sm:rounded-t-xl p-4 pb-6 sm:p-8 lg:p-4 lg:pb-6 xl:p-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8">
                <div className="flex items-center space-x-3.5 sm:space-x-5 lg:space-x-3.5 xl:space-x-5">
                    <img
                        src={imageUrl}
                        alt=""
                        width="160"
                        height="160"
                        className="flex-none w-20 h-20 rounded-lg bg-gray-100"
                    />
                    <div className="min-w-0 flex-auto space-y-0.5">
                        <h2 className="text-base sm:text-xl lg:text-base xl:text-xl font-semibold truncate">
                            {songTitle}
                        </h2>
                        <p className="text-gray text-base sm:text-lg lg:text-base xl:text-lg font-medium">
                            {artistName}
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="bg-default rounded-full overflow-hidden">
                        <div
                            className="seekbar-line h-1.5"
                            style={{ width: `${progressBarWidthPct}%` }}
                        ></div>
                    </div>
                    <div className=" flex justify-between text-sm font-medium tabular-nums">
                        <div>{progressTime}</div>
                        <div>{durationTime}</div>
                    </div>
                </div>
            </div>
            <div className="text-white bg-default-soft lg:rounded-b-xl py-4 px-1 sm:px-3 lg:px-1 xl:px-3 grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-5 xl:grid-cols-7 items-center">
                {/* Bookmark */}
                <button type="button" className="mx-auto">
                    <svg width="24" height="24" fill="none">
                        <path
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
                {/* Back */}
                <button
                    type="button"
                    className="hidden sm:block lg:hidden xl:block mx-auto"
                    onClick={() => SpotifyApi.previous()}
                >
                    <svg width="17" height="18">
                        <path
                            d="M0 0h2v18H0V0zM4 9l13-9v18L4 9z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
                {/* 30 back */}
                <button type="button" className="mx-auto">
                    <svg width="34" height="39" fill="none">
                        <path
                            d="M12.878 26.12c1.781 0 3.09-1.066 3.085-2.515.004-1.104-.665-1.896-1.824-2.075v-.068c.912-.235 1.505-.95 1.5-1.93.005-1.283-1.048-2.379-2.727-2.379-1.602 0-2.89.968-2.932 2.387h1.274c.03-.801.784-1.287 1.64-1.287.892 0 1.475.541 1.471 1.346.004.844-.673 1.398-1.64 1.398h-.738v1.074h.737c1.21 0 1.91.614 1.91 1.491 0 .848-.738 1.424-1.765 1.424-.946 0-1.683-.486-1.734-1.262H9.797c.055 1.424 1.317 2.395 3.08 2.395zm7.734.025c2.016 0 3.196-1.645 3.196-4.504 0-2.838-1.197-4.488-3.196-4.488-2.003 0-3.196 1.645-3.2 4.488 0 2.855 1.18 4.5 3.2 4.504zm0-1.138c-1.18 0-1.892-1.185-1.892-3.366.004-2.174.716-3.371 1.892-3.371 1.172 0 1.888 1.197 1.888 3.37 0 2.182-.712 3.367-1.888 3.367z"
                            fill="currentColor"
                        />
                        <path
                            d="M1 22c0 8.837 7.163 16 16 16s16-7.163 16-16S25.837 6 17 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path d="M17 0L9 6l8 6V0z" fill="currentColor" />
                    </svg>
                </button>
                {/* Pause/Play */}
                <button type="button" className="mx-auto" onClick={togglePlay}>
                    {isPlaying ? (
                        <svg width="50" height="50" fill="none">
                            <circle
                                className="text-gray-300 dark:text-gray-500"
                                cx="25"
                                cy="25"
                                r="24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M18 16h4v18h-4V16zM28 16h4v18h-4z"
                                fill="currentColor"
                            />
                        </svg>
                    ) : (
                        <svg width="50" height="50" fill="none">
                            <circle
                                className="text-gray-300 dark:text-gray-500"
                                cx="25"
                                cy="25"
                                r="24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <polygon
                                fill="currentColor"
                                points="10.33 7.69 10.33 20.39 20.3 14.04 10.33 7.69"
                                transform="scale(1.8)"
                            />
                        </svg>
                    )}
                </button>
                {/* Forward 30 */}
                <button type="button" className="mx-auto">
                    <svg width="34" height="39" fill="none">
                        <path
                            d="M12.878 26.12c1.781 0 3.09-1.066 3.085-2.515.004-1.104-.665-1.896-1.824-2.075v-.068c.912-.235 1.505-.95 1.5-1.93.005-1.283-1.048-2.379-2.727-2.379-1.602 0-2.89.968-2.932 2.387h1.274c.03-.801.784-1.287 1.64-1.287.892 0 1.475.541 1.471 1.346.004.844-.673 1.398-1.64 1.398h-.738v1.074h.737c1.21 0 1.91.614 1.91 1.491 0 .848-.738 1.424-1.765 1.424-.946 0-1.683-.486-1.734-1.262H9.797c.055 1.424 1.317 2.395 3.08 2.395zm7.734.025c2.016 0 3.196-1.645 3.196-4.504 0-2.838-1.197-4.488-3.196-4.488-2.003 0-3.196 1.645-3.2 4.488 0 2.855 1.18 4.5 3.2 4.504zm0-1.138c-1.18 0-1.892-1.185-1.892-3.366.004-2.174.716-3.371 1.892-3.371 1.172 0 1.888 1.197 1.888 3.37 0 2.182-.712 3.367-1.888 3.367z"
                            fill="currentColor"
                        />
                        <path
                            d="M33 22c0 8.837-7.163 16-16 16S1 30.837 1 22 8.163 6 17 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <path d="M17 0l8 6-8 6V0z" fill="currentColor" />
                    </svg>
                </button>
                {/* Next */}
                <button
                    type="button"
                    className="hidden sm:block lg:hidden xl:block mx-auto"
                    onClick={() => SpotifyApi.next()}
                >
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none">
                        <path d="M17 0H15V18H17V0Z" fill="currentColor" />
                        <path d="M13 9L0 0V18L13 9Z" fill="currentColor" />
                    </svg>
                </button>
                {/* Speed */}
                <button
                    type="button"
                    className="mx-auto border border-gray-300 rounded-md text-sm font-medium py-0.5 px-2 text-gray-500 dark:border-gray-600 dark:text-gray-400"
                >
                    1.0x
                </button>
            </div>
        </div>
    )
}
