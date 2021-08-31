import React, { useEffect, useState } from 'react'
import SpotifyApi from '../api/spotify'
import cloudFunctions from '../api/cloudFunctions'

const OAuthCallbackScreen = ({ user: loggedInUser }) => {
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
                firebaseUserUid: loggedInUser.firebaseUserUid,
            })
        }

        createSpotifySocialLink()
    }, [loggedInUser])
    return (
        <div>
            {user &&
                `Hey ${user.display_name}, you've successfully linked your Spotify account.`}
            <button onClick={() => getAndSetUser()}>Fetch user</button>
            <br />
            <a href="/spotify/currently-playing">
                Get the lyrics of currently playing song
            </a>
        </div>
    )
}

export default OAuthCallbackScreen
