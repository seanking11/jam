'use strict'
const admin = require('firebase-admin')
admin.initializeApp()

module.exports = async function({ userId, songId }, spotifyTrack) {
    const db = admin.firestore()

    // Hit Spotify API

    const songRef = db.collection('songs').doc(songId)
    await songRef.update({
            spotifySong: {
                id: spotifyTrack.id
            }
    })
}

