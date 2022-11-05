import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL + '/public'

const getDocuemtTypes = () => {
  return axios.get(API_URL + '/document/type')
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getDocuemtTypes,
}
