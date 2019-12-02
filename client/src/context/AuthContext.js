import React, { Component } from 'react';

const Context = React.createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case '':
            return {
                ...state
            };
        default:
            return state;
    }
}

export class AuthProvider extends Component {
    state = {
        dispatch: action => this.setState(state => reducer(state, action))
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        );
    }

}

export const AuthConsumer = Context.Consumer;