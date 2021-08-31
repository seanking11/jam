import React, { useState, useEffect } from 'react'

import cloudFunctions from '../api/cloudFunctions'
import SpotifyApi from '../api/spotify'

export default ({ user }) => {
    const [lyrics, setLyrics] = useState('')

    const [currentlyPlayingSong, setCurrentlyPlayingSong] = useState(null)

    useEffect(() => {
        if (user?.spotifyUser?.accessToken && user?.spotifyUser?.refreshToken) {
            SpotifyApi.setAccessToken(
                user?.spotifyUser?.accessToken,
                user?.spotifyUser?.refreshToken
            )
        }

        const interval = setInterval(async () => {
            const currentlyPlayingResponse = await SpotifyApi.getCurrentlyPlaying()

            if (
                currentlyPlayingResponse &&
                currentlyPlayingResponse?.item?.id !==
                    currentlyPlayingSong?.item?.id
            ) {
                const song = currentlyPlayingResponse?.item
                const title = song?.name
                const artist = song?.artists[0]?.name
                setCurrentlyPlayingSong(currentlyPlayingResponse)
                setLyrics('')

                const lyricsResponse = await cloudFunctions.getLyricsForSong({
                    title,
                    artist,
                })

                setLyrics(lyricsResponse)
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [currentlyPlayingSong, user])

    if (!currentlyPlayingSong) {
        return <div>Loading ...</div>
    }

    const title = `${currentlyPlayingSong?.item?.name} - ${currentlyPlayingSong?.item?.artists[0].name}`
    // const formattedLyrics = lyrics
    const formattedLyrics = lyrics.split('\n').map((i) => {
        // Multiple \n characters in a row will need a <br>
        if (i === '') {
            return <br />
        }

        return <p>{i}</p>
    })

    return (
        <div className="flex h-screen overflow-scroll">
            <div className="m-auto">
                <h1 className="text-3xl">{title}</h1>
                {lyrics && formattedLyrics}
            </div>
        </div>
    )
}
