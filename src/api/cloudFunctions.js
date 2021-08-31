import fetch from 'node-fetch'

const BASE_URL = 'https://us-central1-jams-b177f.cloudfunctions.net/api'

export default {
    /**
     * Link a Spotify account for the first time
     *
     * @TODO switch to GET
     *
     * @param {Object} props
     * @param {String} props.title
     * @param {String} props.artist
     */
    getLyricsForSong: async (props) => {
        console.log('props', props)
        const response = await fetch(
            `${BASE_URL}/getLyricsForSong?title=${encodeURIComponent(
                props.title
            )}&artist=${encodeURIComponent(props.artist)}`,
            {
                method: 'GET',
                // headers: { 'Content-Type': 'plain/text' },
            }
        )

        const text = await response.text()

        console.log('response', text)

        return text
    },
    /**
     * Link a Spotify account for the first time
     *
     * @param {Object} props
     * @param {Object} props.userId
     * @param {Object} props.spotifyUserId
     * @param {Object} props.accessToken
     * @param {Object} props.refreshToken
     */
    createSpotifySocialLink: async (props) => {
        console.log('props', props)
        const response = await fetch(`${BASE_URL}/createSpotifySocialLink`, {
            method: 'POST',
            body: JSON.stringify(props),
            headers: { 'Content-Type': 'application/json' },
        })
        console.log('response', response.body)
        return response.body
    },

    /**
     * Create a track that is a Spotify song
     *
     * @param {Object} props
     * @param {Object} props.songId
     * @param {Object} props.trackId
     * @param {Object} props.spotifyTrack
     */
    createSpotifyTrack: async (props) => {
        const response = await fetch(`${BASE_URL}/createSpotifyTrack`, {
            method: 'POST',
            body: JSON.stringify(props),
            headers: { 'Content-Type': 'application/json' },
        })

        return response.body
    },
}
