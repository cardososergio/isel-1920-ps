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
    unitId: "",
    gotBackofficeChanges: false,
    backofficeData: {},
    alert: {
        show: false,
        text: "none",
        color: "primary",
        fixed: false
    }
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
        case "BACKOFFICE_VERSION_CONTROL":
            return { ...state, gotBackofficeChanges: action.payload }
        case "BACKOFFICE_DATA":
            return { ...state, backofficeData: action.payload }
        case "ALERT":
            return { ...state, alert: action.payload }
        case "UNMOUNT_ALERT":
            return { ...state, alert: { ...state.alert, show: false } }
        default:
            return state;
    }
}

const store = createStore(reducer)

export default store