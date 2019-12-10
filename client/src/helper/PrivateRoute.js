import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, isAuthenticated, data, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            return isAuthenticated ?
                (<Component {...data} {...props} />) :
                (<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                );
        }}
    />
);
