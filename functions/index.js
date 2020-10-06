const functions = require('firebase-functions')

const createSpotifySocialLink = require('./createSpotifySocialLink')

exports.createSpotifySocialLink = functions.https.onCall(
    async (data, context) => {
        const { accessToken, refreshToken, spotifyUserId } = data
        const userId = context.auth.uid

        try {
            await createSpotifySocialLink({
                accessToken,
                refreshToken,
                userId,
                spotifyUserId,
            })
        } catch (err) {
            console.log('Error creating social link', err)
            return response.send(err).statusCode(400)
        }

        return 'Successfully created Spotify link'
    }
)
