const admin = require('firebase-admin')
admin.initializeApp()

module.exports = async function({
    userId,
    spotifyUserId,
    accessToken,
    refreshToken,
}) {
    const db = admin.firestore()

    await db
        .collection('users')
        .doc(userId)
        .set(
            {
                spotifyUser: {
                    id: spotifyUserId,
                    accessToken,
                    refreshToken,
                },
            },
            { merge: true }
        )
}
