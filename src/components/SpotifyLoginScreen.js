import React, { useEffect, useState } from 'react'

export const authEndpoint = 'https://accounts.spotify.com/authorize'
// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '16e1d334a4574a7396b5cb6fd7f36f07'
const redirectUri = 'http://localhost:3000/oauth/callback'
const scopes = ['user-read-currently-playing', 'user-read-playback-state']
// Get the hash of the url
const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function(initial, item) {
        if (item) {
            var parts = item.split('=')
            initial[parts[0]] = decodeURIComponent(parts[1])
        }
        return initial
    }, {})
window.location.hash = ''

const SpotifyLoginScreen = () => {
    const [token, setToken] = useState(null)
    useEffect(() => {
        let _token = hash.access_token
        if (_token) {
            // Set token
            setToken(_token)
        }
    }, [setToken])

    return (
        <div>
            <div className="App">
                <header className="App-header">
                    {!token && (
                        <a
                            className="btn btn--loginApp-link"
                            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                                '%20'
                            )}&response_type=code&show_dialog=true`}
                        >
                            Login to Spotify
                        </a>
                    )}
                    {token && (
                        // Spotify Player Will Go Here In the Next Step
                        <div></div>
                    )}
                </header>
            </div>
        </div>
    )
}

export default SpotifyLoginScreen
