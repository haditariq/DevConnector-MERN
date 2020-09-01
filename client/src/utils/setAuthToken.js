import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-header'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-header'];
  }
};

export default setAuthToken;
