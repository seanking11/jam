const cors = require('cors')
const express = require('express')
const functions = require('firebase-functions')

const createSpotifySocialLink = require('./createSpotifySocialLink')
const createSpotifyTrack = require('./createSpotifyTrack')
const getLyricsForSong = require('./getLyricsForSong')

const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

app.post('/createSpotifySocialLink', async (request, response) => {
    const {
        accessToken,
        refreshToken,
        spotifyUserId,
        firebaseUserUid,
    } = request.body

    try {
        await createSpotifySocialLink({
            accessToken,
            refreshToken,
            userId: firebaseUserUid,
            spotifyUserId,
        })

        return response.status(201).send('Successfully created Spotify link')
    } catch (err) {
        console.log('Error creating social link', err)
        return response.send(err)
    }
})

app.post('/createSpotifyTrack', async (request, response) => {
    const { songId, spotifyTrack } = request.body
    const userId = response.auth.uid

    try {
        await createSpotifyTrack(
            {
                userId,
                songId,
            },
            spotifyTrack
        )

        return response.send('Successfully created Spotify track')
    } catch (err) {
        console.log('Error creating Spotify track', err)
        return response.send(err)
    }
})

app.get('/getLyricsForSong', async (request, response) => {
    const { title, artist } = request.query

    try {
        const lyrics = await getLyricsForSong({
            title,
            artist,
        })

        return response.send(lyrics)
    } catch (err) {
        console.log('Error getting lyrics', err)
        return response.send(err)
    }
})

exports.api = functions.https.onRequest(app)
