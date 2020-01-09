import React, { useState } from 'react'
import firebase from 'firebase/app'

const SignIn = ({ toggleVisibility, setUser }) => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)

    const handleSignIn = async () => {
        try {
            const response = await firebase.auth().signInWithEmailAndPassword(email, password)
            console.log(response)
            if (response) setUser({ name: 'sean' })
        } catch (err) {
            console.log(err)
            setError(err.message)
        }
    }

    return (
        <div>
            <h4>Sign In</h4>
            {/* <form id='sign-in'> */}
                <input type='text' placeholder='guitarguy69@gmail.com' onChange={e => setEmail(e.target.value)} />
                <input type='password' onChange={e => setPassword(e.target.value)} />
                {/* <button onSubmit={handleSignIn} type='submit' form='sign-in'>Sign In</button> */}
                <button onClick={handleSignIn}>Sign In</button>
            {/* </form> */}
            <div onClick={() => toggleVisibility()}>Need an account?</div>

            <hr />

            {error && <div>{error}</div> }
        </div>
    )
}

export default SignIn
