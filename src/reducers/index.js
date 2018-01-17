import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  fooStore: (state = {}, action) => state,
  barStore: (state = {}, action) => state
});

export default rootReducer;
