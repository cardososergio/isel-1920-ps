import { createStore } from 'redux'

const initialState = {
    login: false,
    filter: {
        year: { id: "", value: "Todos" },
        semester: { id: "", value: "Todos" },
        unit: { id: "", value: "Todas" },
        season: { id: "", value: "Todas" }
    },
    unitsView: "card",
    unitId: ""
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case "LOGIN":
            return { ...state, login: true }
        case "FILTER":
            return { ...state, filter: action.payload }
        case "FILTER_UNIT":
            return {
                ...state, filter: { ...state.filter, unit: action.payload }
            }
        case "UNITS_VIEW":
            return { ...state, unitsView: action.payload }
        case "UNIT_ID":
            return { ...state, unitId: action.payload }
        default:
            return state;
    }
}

const store = createStore(reducer)

export default store