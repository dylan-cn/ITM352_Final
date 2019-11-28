import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const checkAuth = (auth) => {
    console.log("private route says: " + auth);
    return auth;
}

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

// export const PrivateRoute = ({ component: Component, isAuthenticated, isLoading, ...rest }) => {
//     console.log(`auth: ${isAuthenticated} isloading: ${isLoading}`)
//     if (isLoading) {
//         return <div>Loading...</div>
//     }
//     if (!isAuthenticated) {
//         return <Redirect to="/login" />
//     }
//     return <Component {...props} />
// }