// action - state management
import * as actionTypes from './actions';

const initialState = {};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return { ...state, ...action.data };
        case actionTypes.RESET_USER:
            return initialState;
        default:
            return state;
    }
};

export default userReducer;
