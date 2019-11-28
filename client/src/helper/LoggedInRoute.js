import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const LoggedInRoute = ({ component: Component, updateAuth, display, isAuthenticated, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            // return isLoading ? null : isAuthenticated ?
            //     (<Component {...props} />) :
            //     (<Redirect to={{ pathname: '/', state: { from: props.location } }} />);
            return display ? (<Component updateAuth={updateAuth} {...props} />) : isAuthenticated ? (<Redirect to={{ pathname: '/', state: { from: props.location } }} />) : null;
        }}
    />
);