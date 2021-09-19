import config from '../config'

const { clientId, clientSecret } = config.spotify
const { apiUrl } = config.firebase

class SpotifyApi {
    constructor(accessToken = null, refreshToken = null) {
        this.baseUrl = 'https://api.spotify.com/v1'
        this.accessToken = accessToken
        this.refreshToken = refreshToken
    }

    /**
     * @TODO Make this retry on 401's
     *
     * @param {String} url
     * @param {Object} fetchOptions
     * @param {Boolean} [shouldRefreshTokenOnFailure = true] On receiving a 401, get a new access token and retry
     * @returns {Promise<any>}
     * @private
     */
    async _spotifyRequest(
        url,
        fetchOptions,
        shouldRefreshTokenOnFailure = true
    ) {
        try {
            if (this.accessToken) {
                return this._httpRequest(url, fetchOptions)
            } else if (shouldRefreshTokenOnFailure) {
                await this.refreshSpotifyToken()

                return this._httpRequest(url, fetchOptions)
            }
        } catch (err) {
            console.error('Error requesting the Spotify API', err)

            throw err
        }
    }

    async _httpRequest(url, fetchOptions) {
        const _fetchOptions = {
            method: 'GET',
            ...fetchOptions,
        }

        const response = await fetch(url, _fetchOptions)

        return response.json()
    }

    /**
     * Fetches the user's refresh token from Firebase, gets a new access token, and sets it.
     * @returns {Promise<void>}
     */
    async refreshSpotifyToken() {
        const results = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            body: {
                grant_type: 'refresh_token',
                refresh_token: this.refreshToken,
            },
        })

        return results
    }

    /**
     * Fetches an access token for the first time
     *
     * @param authorizationCode
     * @returns {Promise<{accessToken: *, refreshToken: *}>}
     */
    async getAndSetAccessToken(authorizationCode) {
        console.log('getting and setting access token')
        const options = {
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: `${apiUrl}/oauth/callback`,
            }),
            headers: {
                Authorization: `Basic ${new Buffer(
                    clientId + ':' + clientSecret
                ).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/json',
            },
            json: true,
        }
        const data = await this._httpRequest(
            `https://accounts.spotify.com/api/token`,
            options
        )

        const { access_token: accessToken, refresh_token: refreshToken } = data
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        console.table(refreshToken, accessToken)
        return { accessToken, refreshToken }
    }

    async getCurrentlyPlaying() {
        const response = await this._spotifyRequest(
            `${this.baseUrl}/me/player/currently-playing?market=ES`,
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            }
        )

        return response
    }

    async getMe() {
        const user = await this._spotifyRequest(`${this.baseUrl}/me`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        })

        return user
    }

    async next() {
        return this._spotifyRequest(`${this.baseUrl}/me/player/next`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        })
    }

    async previous() {
        return this._spotifyRequest(`${this.baseUrl}/me/player/previous`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        })
    }

    async pause() {
        return this._spotifyRequest(`${this.baseUrl}/me/player/pause`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        })
    }

    async play() {
        return this._spotifyRequest(`${this.baseUrl}/me/player/play`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        })
    }

    async search(query, type) {
        const results = await this._spotifyRequest(
            `${this.baseUrl}/search?q=${query}&type=${type}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
                json: true,
            }
        )
        console.log('results from spotify track', results)

        return results
    }

    /**
     * Used to set access/refresh tokens after Spotify API has been instantiated
     *
     * @param {String} accessToken
     * @param {String} refreshToken
     */
    setAccessToken(accessToken, refreshToken) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
    }
}

export default new SpotifyApi()
