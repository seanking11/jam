import React, { useEffect, useRef, useState, useContext } from 'react'
import VideoRecorder from 'react-video-recorder'
import firebase from 'firebase'

import './App.css'
import firebaseConfig from './config'

import { SongList, LoginScreen, Router } from './components'

const mediaConstraints = {
    audio: true,
    video: {
        width: { min: 1280 },
        height: { min: 720 },
    },
}

// Get an extension that allows you to write arrow functions, normal functions, objects, etc.

function App() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        firebase.initializeApp(firebaseConfig)
        firebase.analytics()

        firebase.auth().onAuthStateChanged((user) => {
            if (user) setUser(user)
            console.log('user', user)
            setLoading(false)
        })
    }, [])

    if (loading) return <div>Loading...</div>

    return (
        <div className="App">
            <Router user={user} setUser={setUser} />
            {/* {user ? <SongList user={user} /> : <LoginScreen setUser={setUser} />} */}
        </div>
    )
}

export default App
