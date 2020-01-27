import React, { useState, useContext } from 'react'

import { SignIn, SignUp } from './index'
import AuthContext from '../state/AuthContext'

const LoginScreen = ({ history }) => {
    const [showSignIn, setShowSignIn] = useState(true)
    const { setUser } = useContext(AuthContext)

    const toggleShowSignIn = () => {
        setShowSignIn(!showSignIn)
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
