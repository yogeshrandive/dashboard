import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

import { Link } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import { login } from '../../../actions/auth'

const Login = () => {
  let navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const [validated, setValidated] = useState(false)

  const { isLoggedIn } = useSelector((state) => {
    return state.auth
  })
  const { message } = useSelector((state) => state.message)

  const dispatch = useDispatch()

  const onChangeUsername = (e) => {
    const username = e.target.value
    setUsername(username)
  }

  const onChangePassword = (e) => {
    const password = e.target.value
    setPassword(password)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setLoading(true)

    const form = event.currentTarget
    if (form.checkValidity() === false) {
      setLoading(false)
      event.preventDefault()
      event.stopPropagation()
    } else {
      dispatch(login(username, password))
        .then(() => {
          setValidated(true)
          setVisible(true)
          navigate('/dashboard')
          window.location.reload()
        })
        .catch((error) => {
          console.log('error123123', error)
          setVisible(true)

          console.error(error)
          setLoading(false)
        })
    }
  }

  if (isLoggedIn) {
    //console.log('islogin', isLoggedIn)
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm noValidate validated={validated} onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        id="email"
                        autoComplete="email"
                        required
                        type="email"
                        feedbackInvalid="Please enter a valid email ID."
                        onChange={onChangeUsername}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        feedbackInvalid="Please enter a password."
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        id="password"
                        required
                        onChange={onChangePassword}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit" di>
                          Login
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
                <CAlert
                  color="primary"
                  dismissible
                  visible={visible}
                  onClose={() => setVisible(false)}
                >
                  {message}
                </CAlert>
                {/* <CButton color="primary" onClick={() => setVisible(true)}>
                  Show live alert
                </CButton> */}
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
