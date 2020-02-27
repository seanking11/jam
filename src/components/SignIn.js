import React, { useState } from 'react'
import firebase from 'firebase/app'

const SignIn = ({ toggleVisibility, setUser, history }) => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)

    const handleSignIn = async () => {
        try {
            const response = await firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
            if (response) setUser(response.user)
            history.push('/songs')
        } catch (err) {
            console.log('Error logging in', err)
            setError(err.message)
        }
    }

    return (
        <div>
            <h4>Sign In</h4>
            <input
                type="text"
                className="text-black"
                placeholder="guitarguy69@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                className="text-black"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignIn}>Sign In</button>
            <div onClick={() => toggleVisibility()}>Need an account?</div>

            <hr />

            {error && <div>{error}</div>}
        </div>
    )
}

export default SignIn
