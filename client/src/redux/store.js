import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import alert from './alert/reducers';
import { combineReducers } from 'redux';
import register from './auth/reducers';
import profile from './profile/reducers';

const initialState = {};
const middleware = [thunk];

// Reducers
const rootReducer = combineReducers({
  alert,
  register,
  profile
});

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
