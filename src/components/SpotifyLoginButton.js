import React from 'react'
import SpotifyLogo from '../assets/spotify.svg'
import config from '../config'

export const authEndpoint = 'https://accounts.spotify.com/authorize'
// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '16e1d334a4574a7396b5cb6fd7f36f07'
const redirectUri = `${config.firebase.apiUrl}/oauth/callback`
const scopes = [
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-modify-playback-state',
]

const SpotifyLoginButton = ({ children }) => {
    return (
        <a
            className="flex text-2xl p-4 font-semibold"
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                '%20'
            )}&response_type=code&show_dialog=true`}
        >
            <img
                src={SpotifyLogo}
                className="mr-1"
                height="25px"
                width="25px"
                alt="Spotify logo"
            />
            <div>{children}</div>
        </a>
    )
}

export default SpotifyLoginButton
