import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';

type Product = {
  id: number;
  // Add other properties of the product
};

type State = Product[];

type Action =
  | { type: 'add product'; payload: Product }
  | { type: 'change product'; payload: Product }
  | { type: 'remove product'; payload: number };

const initialState: State = [];
const StoreContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

type StateProviderProps = {
  children: ReactNode;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'add product':
      return [...state, action.payload];
    case 'change product':
      return [action.payload];
    case 'remove product':
      return state.filter(({ id }) => id !== action.payload);
    default:
      throw new Error();
  }
};

const StateProvider = ({ children }: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StateProvider };