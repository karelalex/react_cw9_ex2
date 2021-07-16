import {SET_USER_INITIALS} from "./action";
import {isFunction} from "lodash";

const {createStore} = require("redux");

const initialState = {
    userInitials: null
}

const reduce = {
    [SET_USER_INITIALS]: (state, payload) => ({...state, userInitials: payload})
}

export const reducer = (state = initialState, action) => {
    const reduceFunction = reduce[action.type]
    return isFunction(reduceFunction) ? reduceFunction(state, action.payload) : state
}

export const store = createStore(reducer)
