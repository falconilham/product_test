import React, { createContext, useReducer } from 'react';

const initialState = []
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'add product':
                const result = [...state, action.payload]
                return result
            case 'change product':
                return action.payload
            case 'remove product':
                const removedItem = [...state].filter(({ id }) => id !== action.payload)
                return removedItem
            default:
                throw new Error();
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }