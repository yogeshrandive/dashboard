import axios from 'axios'
import authHeader from './auth-header'

const API_URL = process.env.REACT_APP_API_URL + '/v1/customer'

const getAllCustomers = () => {
  return axios.get(API_URL + '/', { headers: authHeader() })
}

const saveCustomer = (data) => {
  data.pictures = [
    {
      id_type: 1,
      s3_url:
        'https://assets-global.website-files.com/5f689f82910c6b4f1ffb855b/613b1f91b195318100f7d27e_aadhar%20card%402x-min.jpg',
    },
  ]
  return axios.post(API_URL + '/', data, { headers: authHeader() })
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAllCustomers,
  saveCustomer,
}
