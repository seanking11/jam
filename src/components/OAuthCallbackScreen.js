import React, { useEffect, useState } from 'react'
import SpotifyApi from '../api/spotify'
import cloudFunctions from '../api/cloudFunctions'

const OAuthCallbackScreen = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const authorizationCode = urlParams.get('code')

        const createSpotifySocialLink = async function() {
            const tokens = await SpotifyApi.getAndSetAccessToken(
                authorizationCode
            )
            const _user = await SpotifyApi.getMe()

            await cloudFunctions.createSpotifySocialLink({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                spotifyUserId: _user.id,
            })

            setUser(_user)
        }

        createSpotifySocialLink()
    }, [])
    return (
        <div>
            {user &&
                `Hey ${user.display_name}, you've successfully linked your Spotify account.`}
            <a href="/songs">Go to Songs</a>
        </div>
    )
}

export default OAuthCallbackScreen
