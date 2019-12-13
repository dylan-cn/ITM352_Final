import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const AdminRoute = ({ component: Component, isAuthenticated, role, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            return isAuthenticated && role === 'admin' ?
                (<Component {...props} />) :
                (<Redirect to={{ pathname: '/', state: { from: props.location } }} />
                );
        }}
    />
);
