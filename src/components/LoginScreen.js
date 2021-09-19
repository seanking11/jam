import React, { useState, useContext } from 'react'
import { Redirect } from 'react-router-dom'

import { SignIn, SignUp } from './index'
import AuthContext from '../state/AuthContext'

const LoginScreen = ({ history }) => {
    const [showSignIn, setShowSignIn] = useState(true)
    const authContext = useContext(AuthContext)
    const setUser = authContext.setUser

    const toggleShowSignIn = () => {
        setShowSignIn(!showSignIn)
    }

    if (authContext?.user?.firebaseUserUid) {
        return <Redirect to="/songs" />
    }

    return (
        <div>
            {showSignIn ? (
                <SignIn
                    toggleVisibility={toggleShowSignIn}
                    setUser={setUser}
                    history={history}
                />
            ) : (
                <SignUp
                    toggleVisibility={toggleShowSignIn}
                    setUser={setUser}
                    history={history}
                />
            )}
        </div>
    )
}

export default LoginScreen
