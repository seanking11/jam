import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import AuthContext from '../state/AuthContext'

const PrivateRoute = ({ component: Component, path, user, ...rest }) => {
    const authContext = useContext(AuthContext)

    return (
        <Route
            {...rest}
            render={(props) =>
                authContext?.user?.firebaseUserUid ? (
                    <Component user={authContext?.user} {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    )
}

export default PrivateRoute
