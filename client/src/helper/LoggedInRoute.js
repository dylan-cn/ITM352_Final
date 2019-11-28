import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const LoggedInRoute = ({ component: Component, isAuthenticated, isLoading, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            return isLoading ? null : isAuthenticated ?
                (<Component {...props} />) :
                (<Redirect to={{ pathname: '/', state: { from: props.location } }} />
                );
        }}
    />
);