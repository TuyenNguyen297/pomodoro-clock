import actions from "../constants/constants.js";
const initialState = {
    sessionTime: 25,
    breakTime: 5,
    resume: false,
}

function limit(num) {
    return num < 0 ? 60 : num > 60 ? 0 : num;
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case actions.RESUME:
            return Object.assign({}, state, { resume: !state.resume })
        case actions.RESET:
            return Object.assign({}, initialState, { toggleReset: !state.toggleReset })
        case actions.INCREMENT:
            return Object.assign({}, state, action.subject === "session" ? { sessionTime: limit(state.sessionTime + 1) } : action.subject === "break" ? { breakTime: limit(state.breakTime + 1) } : state)
        case actions.DECREMENT:
            return Object.assign({}, state, action.subject === "session" ? { sessionTime: limit(state.sessionTime - 1) } : action.subject === "break" ? { breakTime: limit(state.breakTime - 1) } : state)
        default: return state;
    }
}
