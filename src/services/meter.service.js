import axios from 'axios'
import authHeader from './auth-header'

const API_URL = process.env.REACT_APP_API_URL + '/v1/meter'

const getAll = () => {
  return axios.get(API_URL + '/', { headers: authHeader() })
}

const create = (data) => {
  return axios.post(API_URL + '/', data, { headers: authHeader() })
}

const getById = (id) => {
  return axios.get(API_URL + `/${id}`, { headers: authHeader() })
}

const update = (data, id) => {
  return axios.post(API_URL + `/${id}`, data, { headers: authHeader() })
}

const getActiveMeter = () => {
  return axios.get(API_URL + '/', { params: { active: 1 }, headers: authHeader() })
}

const assignMeter = (idMeter, id_customer) => {
  return axios.post(API_URL + `/${idMeter}/consumer`, { id_customer }, { headers: authHeader() })
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll,
  create,
  getById,
  update,
  getActiveMeter,
  assignMeter,
}
