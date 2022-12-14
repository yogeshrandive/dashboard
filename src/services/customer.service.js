import axios from 'axios'
import authHeader from './auth-header'

const API_URL = process.env.REACT_APP_API_URL + '/v1/customer'

const getAllCustomers = () => {
  return axios.get(API_URL + '/', { headers: authHeader() })
}

const saveCustomer = (data) => {
  return axios.post(API_URL + '/', data, { headers: authHeader() })
}

const getById = (id) => {
  return axios.get(API_URL + `/${id}`, { headers: authHeader() })
}

const update = (id, data) => {
  return axios.post(API_URL + `/${id}`, data, { headers: authHeader() })
}

const getAssignMeter = (id) => {
  return axios.get(API_URL + `/${id}/meter`, { headers: authHeader() })
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAllCustomers,
  saveCustomer,
  getById,
  update,
  getAssignMeter,
}
