import Reducer from "./reducers/reducer";
import { legacy_createStore as createStore } from 'redux'

const store = createStore(Reducer);

export default store;