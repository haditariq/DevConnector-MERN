import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_FAIL,
  LOGIN_SUCCESS, LOGOUT
} from './types';
import axios from 'axios';
import { setAlert } from '../alert/actions';
import setAuthToken from '../../utils/setAuthToken';

export const loadUSer = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('http://localhost:5000/api/auth/');
    console.log({user1111: res.data})
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (e) {
    console.log(e.message)
    dispatch({
      type: AUTH_ERROR
    });
  }
};

export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post('/api/users', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUSer())
  } catch (e) {
    const errors = e.response.data.errors;
    if (errors)
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 3000)));
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

export const login = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post('/api/auth/login', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUSer())
  } catch (e) {
    const errors = e.response.data.errors;
    if (errors)
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 3000)));
    dispatch({
      type: LOGIN_FAIL
    });
  }
};


export const logout = () => async dispatch => {
  console.log("logout action dispatch")
    dispatch({
      type: LOGOUT
    });
};
