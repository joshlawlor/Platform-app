import React from 'react';
import {Navigate, Route } from 'react-router-dom';
import {getToken} from  '../service/AuthService';
const PublicRoute = ({component: Component, ...rest}) => {
    return(
        <Route
        {...rest}
        render={props => {
            return !getToken() ? <Component {...props} />
            : <Navigate to={{pathname: '/home'}}/>
        }}
        />
    )
}

export default PublicRoute