import React, { useState } from 'react'
import firebase from 'firebase/app'

const SignUp = ({ toggleVisibility, history, setUser }) => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)

    const handleSignUp = async (e) => {
        try {
            e.preventDefault()
            const response = await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
            history.push('/songs')
            setUser(response.user)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="flex h-screen">
            <div className="p-10 s:p-0 m-auto md:w-full md:max-w-md">
                <h1 className="font-bold text-center text-2xl mb-5">
                    Create an account
                </h1>
                <div className="bg-default-hard shadow w-full rounded-lg divide-y divide-gray-200">
                    <div className="px-5 py-7">
                        <form onSubmit={handleSignUp}>
                            <label className="font-semibold text-sm text-gray-100 pb-1 block">
                                E-mail
                            </label>
                            <input
                                type="text"
                                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full text-white bg-default "
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label className="font-semibold text-sm text-gray-100 pb-1 block">
                                Password
                            </label>
                            <input
                                type="password"
                                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full text-white bg-default"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="transition duration-200 bg-primary hover:bg-primary-soft text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                            >
                                <span className="inline-block mr-2">
                                    Create an account
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-4 h-4 inline-block"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </button>
                        </form>

                        <div
                            onClick={() => toggleVisibility()}
                            className="italic text-sm text-center text-gray-100 mt-2 cursor-pointer"
                        >
                            Already have an account?
                        </div>

                        {error && <div>{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
