import React, { useState } from 'react'
import {
  CButton,
  CRow,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CAlert,
  CCol,
  CCardHeader,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'

import CustomerService from './../../services/customer.service'
import EventBus from './../../common/EventBus'

function CreateCustomer() {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState('')

  const [visible, setVisible] = useState(false)
  const [validated, setValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const dispatch = useDispatch()

  const { message } = useSelector((state) => state.message)

  const onChangeFN = (e) => {
    setFirstname(e.target.value)
  }
  const onChangeLN = (e) => {
    setLastname(e.target.value)
  }
  const onChangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const onChangeMobile = (e) => {
    setMobile(e.target.value)
  }
  const onChangeAddress = (e) => {
    setAddress(e.target.value)
  }
  const onChangeLoc = (e) => {
    setLocation(e.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      CustomerService.saveCustomer({ firstname, lastname, email, mobile, address, location })
        .then((res) => {
          setFirstname('')
          setLastname('')
          setEmail('')
          setMobile('')
          setAddress('')
          setLocation('')

          setValidated(false)
          setVisible(true)
          setErrorMessage('Success: Customer created successfully ')
        })
        .catch((error) => {
          console.log('error', error)
          console.log('error', error.code)
          let message = ''
          if (error.code === 'ERR_NETWORK') message = error.message
          else
            message =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString() ||
              'Server Error'

          console.log('message', message)

          setValidated(false)
          setVisible(true)
          setErrorMessage(`Error: ${message}`)
        })
    }
    setValidated(true)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Customer</strong> <small>Onboard</small>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="firstname">First Name</CFormLabel>
                <CFormInput
                  id="firstname"
                  required
                  feedbackInvalid="Please enter a valid first name."
                  onChange={onChangeFN}
                  value={firstname}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="lastname">Last Name</CFormLabel>
                <CFormInput
                  id="lastname"
                  feedbackInvalid="Please enter a valid last name."
                  required
                  onChange={onChangeLN}
                  value={lastname}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  id="email"
                  feedbackInvalid="Please enter a valid Email Id."
                  required
                  onChange={onChangeEmail}
                  value={email}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="mobile">mobile</CFormLabel>
                <CFormInput
                  id="mobile"
                  required
                  feedbackInvalid="Please enter a valid mobile."
                  onChange={onChangeMobile}
                  value={mobile}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="address">Address</CFormLabel>
                <CFormTextarea
                  id="address"
                  rows="3"
                  required
                  feedbackInvalid="Please enter a valid address."
                  onChange={onChangeAddress}
                  value={address}
                ></CFormTextarea>
              </div>
              <div>
                <CFormSelect
                  size="lg"
                  className="mb-3"
                  aria-label="Large select example"
                  aria-describedby="validationCustom04Feedback"
                  feedbackInvalid="Please select a valid state."
                  onChange={onChangeLoc}
                  id="validationCustom04"
                  label="State"
                  value={location}
                  required
                >
                  <option key="" value="">
                    Locations
                  </option>
                  <option key="1" value="1">
                    Mumbai
                  </option>
                  <option key="2" value="2">
                    Belgam
                  </option>
                </CFormSelect>
              </div>
              <div>
                <CButton className="px-4" type="submit">
                  Submit
                </CButton>
              </div>
            </CForm>
          </CCardBody>
          <CAlert color="primary" dismissible visible={visible} onClose={() => setVisible(false)}>
            {errorMessage}
          </CAlert>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateCustomer
