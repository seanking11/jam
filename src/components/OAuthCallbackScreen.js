import React, { useEffect, useState } from 'react'
import SpotifyApi from '../api/spotify'

const OAuthCallbackScreen = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const authorizationCode = urlParams.get('code')

        const fetchUser = async function() {
            await SpotifyApi.getAndSetAccessToken(authorizationCode)
            const _user = await SpotifyApi.getMe()
            console.log(_user)
            setUser(_user)
        }

        fetchUser()
    }, [])
    return <div>{user && `Hey ${user.display_name}`}</div>
}

export default OAuthCallbackScreen
