// slices/index.ts
import { combineReducers } from 'redux';
import mapReducer from "./mapSlice"
import userKeyReducer from "./UserKey"

const rootReducer = combineReducers({
  map:mapReducer,
  userKey:userKeyReducer
});

export default rootReducer;
