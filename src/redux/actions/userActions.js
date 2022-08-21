import actions from "../constants/constants.js";

function Resume() {
    return { type: actions.RESUME }
}

function Reset() {
    return { type: actions.RESET }
}

function Increment(subjectId) {
    return { type: actions.INCREMENT, subject: subjectId.match(/^\w+(?!-)\w+/g)[0] }
}

function Decrement(subjectId) {
    return { type: actions.DECREMENT, subject: subjectId.match(/^\w+(?!-)\w+/g)[0] }
}

// function Countdown(time) {
//     return { type: actions.COUNT_DOWN, currentTime: time }
// }

export { Resume, Reset, Increment, Decrement}