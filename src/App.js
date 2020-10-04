import React, { useEffect, useState } from 'react'
import firebase from 'firebase'

import config from './config'

import { Router } from './components'
import AuthContext from './state/AuthContext'

function App() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        firebase.initializeApp(config.firebase)
        firebase.analytics()

        firebase.auth().onAuthStateChanged((user) => {
            setUser(user)
            console.log('Auth state changed, user -', user)
            setLoading(false)
        })
    }, [])

    if (loading) return <div>Loading...</div>

    return (
        <div className="App">
            <AuthContext.Provider value={{ user, setUser }}>
                <Router />
            </AuthContext.Provider>
        </div>
    )
}

export default App
