import React from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'

import AuthContext from '../state/AuthContext'
import { SongList, Song, LoginScreen, PublicRoute, PrivateRoute } from './'

const Router2 = ({ setUser, user }) => {
    console.log('user', user)
    return (
        // <AuthContext.Provider value={user}>
        <Router>
            {/* <Route
                exact
                path="/login"
                component={() => <LoginScreen setUser={setUser} />}
            /> */}

            <Route exact user={user} path="/songs" component={SongList} />
            <Route exact user={user} path="/songs/:songId" component={Song} />

            {/* <PrivateRoute
                    user={user}
                    // path="/songs/:songId"
                    path="/test"
                    component={Song}
                /> */}
        </Router>
        /* </AuthContext.Provider> */
    )
}

export default Router2
