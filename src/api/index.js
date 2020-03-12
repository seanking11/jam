const BASE_URL = 'https://localhost:5000/jams-b177f/us-central1'
// const BASE_URL = 'https://jams-b177f.firebaseapp.com'

export default {
    uploadClip: async function(formData) {
        console.log('formData', formData)
        const response = await fetch(`${BASE_URL}/uploadClip`, {
            method: 'POST',
            body: formData,
        })

        console.log('response', response)
    },
}
