import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, isAuthenticated, isLoading, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            return isLoading ? null : isAuthenticated ?
                (<Component {...props} />) :
                (<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                );
        }}
    />
);
