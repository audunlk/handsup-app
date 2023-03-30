import { configureStore } from '@reduxjs/toolkit';


const initialState = {
    user: null,
    isLoading: true,
    token: '',
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
            }
        case 'SET_IS_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            }
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.payload,
            }
        default:
            return state;
    }
}

const store = configureStore({
    reducer: rootReducer,
})


console.log(store.getState());