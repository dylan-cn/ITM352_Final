import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const checkAuth = (auth) => {
    console.log("private route says: " + auth);
    return auth;
}

export const PrivateRoute = ({ component: Component, isAuth, ...rest }) => (

    <Route
        {...rest}
        render={props =>
            (checkAuth(isAuth)) ? <Component {...props} /> :
                (<Redirect
                    to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }} />
                )
        }

    />
);