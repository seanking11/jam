import config from '../config'

const { clientId, clientSecret } = config.spotify

class SpotifyApi {
    constructor(accessToken = null, refreshToken = null) {
        this.baseUrl = 'https://api.spotify.com/v1'
        this.accessToken = accessToken
        this.refreshToken = refreshToken
    }

    async _request(url, _options) {
        try {
            const options = {
                method: 'GET',
                ..._options,
            }
            const response = await fetch(url, options)

            return response.json()
        } catch (err) {
            console.error('Error requesting the Spotify API', err)

            throw err
        }
    }

    async getAndSetAccessToken(authorizationCode) {
        const options = {
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: 'http://localhost:3000/oauth/callback',
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
        const data = await this._request(
            `https://accounts.spotify.com/api/token`,
            options
        )

        const { access_token: accessToken, refresh_token: refreshToken } = data
        this.accessToken = accessToken
        this.refreshToken = refreshToken

        return { accessToken, refreshToken }
    }

    async getMe() {
        const user = await this._request(`${this.baseUrl}/me`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        })

        return user
    }

    async search(query, type) {
        const results = await this._request(`${this.baseUrl}/search?q=${query}&type=${type}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
            json: true
        })
        console.log('results from spotify track', results)
    }
}

export default new SpotifyApi()
