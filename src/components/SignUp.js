import React, { useState } from 'react'
import firebase from 'firebase/app'

const SignUp = ({ toggleVisibility }) => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)

    const handleSignUp = async () => {
        try {
            await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div>
            <h4>Sign Up</h4>
            {/* <form id='sign-up'> */}
            <input
                type="text"
                placeholder="guitarguy69@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            {/* <button onSubmit={handleSignUp} form='sign-up'>Sign Up!</button> */}
            <button onClick={handleSignUp}>Sign Up!</button>
            {/* </form> */}
            <div onClick={() => toggleVisibility()}>
                Already have an account?
            </div>

            <hr />

            {error && <div>{error}</div>}
        </div>
    )
}

export default SignUp
