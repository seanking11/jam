import { functions } from '../firebase'

export default {
    /**
     * Link a Spotify account for the first time
     *
     * @param {Object} props
     * @param {Object} props.userId
     * @param {Object} props.spotifyUserId
     * @param {Object} props.accessToken
     * @param {Object} props.refreshToken
     */
    createSpotifySocialLink: functions.httpsCallable('createSpotifySocialLink'),

    /**
     * Create a track that is a Spotify song
     *
     * @param {Object} props
     * @param {Object} props.songId
     * @param {Object} props.trackId
     * @param {Object} props.spotifyTrack
     */
    createSpotifyTrack: functions.httpsCallable('createSpotifyTrack'),
}
