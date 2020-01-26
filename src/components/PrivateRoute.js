import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import AuthContext from '../state/AuthContext'
import LoginScreen from './LoginScreen'

const PrivateRoute = ({ component: Component, path, user, ...rest }) => {
    // const user = useContext(AuthContext)
    console.log('context user', user)

    return (
        <Route
            {...rest}
            render={(props) =>
                user?.uid2 ? <Component {...props} /> : <Redirect to="/login" />
            }
        />
    )
}

export default PrivateRoute

// live clue
