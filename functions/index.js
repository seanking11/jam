const functions = require('firebase-functions')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.uploadClip = functions.https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    const { body } = request
    console.log(body)
    response.send('Hello from Firebase!')
})
