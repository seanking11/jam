import React from 'react'
import { Route } from 'react-router-dom'

const PublicRoute = ({ component: Component, path, ...rest }) => (
    <Route path={path} component={Component} />
)

export default PublicRoute
