import axios from 'axios';
import { PROFILE_ERROR, GET_PROFILE } from './types';

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('http://localhost:5000/api/profile/me');
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (e) {
    console.log(e.response.data.errors[0].msg)
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: e.response.data.errors[0].msg, status: e.response.status}
    });
  }
};
