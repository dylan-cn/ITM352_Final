import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            return isAuthenticated ?
                (<Component {...props} />) :
                (<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                );
        }}
    />
);
