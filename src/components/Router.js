import React from 'react'
import { BrowserRouter, Switch, Redirect } from 'react-router-dom'

import { SongList, Song, LoginScreen, PublicRoute, PrivateRoute } from './'

const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Redirect exact from="/" to="/songs" />
                <PublicRoute exact path="/login" component={LoginScreen} />

                <PrivateRoute exact path="/songs" component={SongList} />
                <PrivateRoute exact path="/songs/:songId" component={Song} />
            </Switch>
        </BrowserRouter>
    )
}

export default Router
