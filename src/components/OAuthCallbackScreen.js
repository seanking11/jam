import React, { useEffect, useState } from 'react'
import SpotifyApi from '../api/spotify'
import cloudFunctions from '../api/cloudFunctions'

const OAuthCallbackScreen = () => {
    const [user, setUser] = useState(null)

    const getAndSetUser = async () => {
        const _user = await SpotifyApi.getMe()
        setUser(_user)
        return _user
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const authorizationCode = urlParams.get('code')

        const createSpotifySocialLink = async function() {
            const tokens = await SpotifyApi.getAndSetAccessToken(
                authorizationCode
            )

            const user = await getAndSetUser()

            await cloudFunctions.createSpotifySocialLink({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                spotifyUserId: user.id,
            })
        }

        createSpotifySocialLink()
    }, [])
    return (
        <div>
            {user &&
                `Hey ${user.display_name}, you've successfully linked your Spotify account.`}
            <button onClick={() => getAndSetUser()}>Fetch user</button>
            <a href="/songs">Go to Songs</a>
        </div>
    )
}

export default OAuthCallbackScreen
