import { combineReducers } from 'redux';
import authReducer from './auth';
import confReducer from './conf'

export const rootReducer = combineReducers({
  auth: authReducer,
  conf: confReducer
});

const reducers = (state, action) => rootReducer(state, action);

export default reducers;
