import React from 'react'
import { BrowserRouter, Switch, Redirect } from 'react-router-dom'

import {
    LoginScreen,
    OAuthCallbackScreen,
    PrivateRoute,
    PublicRoute,
    Song,
    SongList,
    SpotifyLoginScreen,
    VideoGrid,
} from './'

const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Redirect exact from="/" to="/songs" />
                <PublicRoute exact path="/login" component={LoginScreen} />
                <PublicRoute
                    exact
                    path="/spotify"
                    component={SpotifyLoginScreen}
                />
                <PublicRoute
                    path="/oauth/callback"
                    component={OAuthCallbackScreen}
                />

                <PrivateRoute exact path="/songs" component={SongList} />
                <PrivateRoute exact path="/grid" component={VideoGrid} />
                <PrivateRoute exact path="/songs/:songId" component={Song} />
            </Switch>
        </BrowserRouter>
    )
}

export default Router
