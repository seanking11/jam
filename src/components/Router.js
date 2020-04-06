import React from 'react'
import { BrowserRouter, Switch, Redirect } from 'react-router-dom'

import {
    SongList,
    Song,
    LoginScreen,
    PublicRoute,
    PrivateRoute,
    VideoGrid,
} from './'

const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Redirect exact from="/" to="/songs" />
                <PublicRoute exact path="/login" component={LoginScreen} />
                <PublicRoute exact path="/songs/:songId" component={Song} />

                <PrivateRoute exact path="/songs" component={SongList} />
                <PrivateRoute exact path="/grid" component={VideoGrid} />
            </Switch>
        </BrowserRouter>
    )
}

export default Router
