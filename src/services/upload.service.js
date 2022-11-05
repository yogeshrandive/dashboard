import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL + '/public'

const test = (file, fileName) => {
  return new Promise((resolve, reject) => {
    resolve({
      filename: fileName,
      path: `test/${fileName}`,
    })
  })
}

const s3UploadFile = () => {
  const cofig = {}
}

const serverUpload = (selectedFile, fileName) => {
  let formData = new FormData()
  formData.append('photo', selectedFile, fileName)
  return axios.post(API_URL + '/image', formData)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  test,
  s3UploadFile,
  serverUpload,
}
