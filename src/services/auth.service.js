import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL + '/user/'

const login = (username, password) => {
  return axios
    .post(API_URL + 'login', {
      email: username,
      password,
    })
    .then((response) => {
      console.log('login response', response)

      if (response.data.message) {
        localStorage.setItem('user', JSON.stringify(response.data.message))
      }
      return response.data.message
    })
}

const logout = () => {
  localStorage.removeItem('user')
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login,
  logout,
}
