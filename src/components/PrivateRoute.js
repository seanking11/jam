import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import firebase from 'firebase/app'

import AuthContext from '../state/AuthContext'

const PrivateRoute = ({ component: Component, path, user, ...rest }) => {
    const authContext = useContext(AuthContext)
    const signOut = () => {
        firebase.auth().signOut()
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                authContext?.user?.uid ? (
                    <>
                        <Component user={authContext?.user} {...props} />
                        <button
                            type="button"
                            onClick={signOut}
                            className="float-right p-2"
                        >
                            <span role="img" aria-label="Wave">
                                👋
                            </span>{' '}
                            Sign Out
                        </button>
                    </>
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    )
}

export default PrivateRoute
