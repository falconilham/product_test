import React, { createContext, useReducer } from 'react';

const initialState = []
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'add Task':
                const result = [...state, action.payload]
                return result
            case 'change task':
                const selectedItem = state.find(({ id }) => id === action.payload.id)
                const newItem = {
                    ...selectedItem,
                    status: action.payload.status
                }
                const filterItem = [...state].filter(({ id }) => id !== action.payload.id)
                return [...filterItem, newItem]
            case 'remove task':
                const removedItem = [...state].filter(({ id }) => id !== action.payload)
                return removedItem
            default:
                throw new Error();
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }