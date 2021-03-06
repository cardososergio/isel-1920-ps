﻿import { createStore } from 'redux'

const initialState = {
    login: false,
    filter: {
        year: { id: "", value: "Todos" },
        semester: { id: "", value: "Todos" },
        unit: { id: "", value: "Todas" },
        season: { id: "", value: "Todas" }
    },
    gotBackofficeChanges: false,
    backofficeData: {},
    alert: {
        show: false,
        text: "none",
        color: "primary",
        fixed: false
    },
    viewOnly: false
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
        case "BACKOFFICE_VERSION_CONTROL":
            return { ...state, gotBackofficeChanges: action.payload }
        case "BACKOFFICE_DATA":
            return { ...state, backofficeData: action.payload }
        case "ALERT":
            return { ...state, alert: action.payload }
        case "UNMOUNT_ALERT":
            return { ...state, alert: { ...state.alert, show: false } }
        case "VIEW_ONLY":
            return { ...state, viewOnly: action.payload }
        default:
            return state;
    }
}

const store = createStore(reducer)

export default store