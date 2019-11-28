import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const LoggedInRoute = ({ component: Component, isAuth, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuth ?
                (<Redirect
                    to={{
                        pathname: "/",
                        state: { from: props.location }
                    }} />
                ) :
                (<Component {...props} />)
        }

    />
);