import { createStore } from 'redux'

const initialState = { login: false };

function reducer(state = initialState, action) {

    switch (action.type) {
        case "LOGIN":
            return { ...state, login: true }

        default:
            return state;
    }
}

const store = createStore(reducer)

export default store