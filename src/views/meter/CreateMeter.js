import React, { useState, useRef, useEffect } from 'react'
import {
  CButton,
  CRow,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CAlert,
  CCol,
  CCardHeader,
  CInputGroup,
  CListGroupItem,
} from '@coreui/react'

import MeterService from './../../services/meter.service'
import uploadService from './../../services/upload.service'

function CreateMeter() {
  const fileInput = useRef()
  const [visible, setVisible] = useState(false)
  const [validated, setValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  //   const { location, error } = useCurrentLocation({ timeout: 1000 * 60 * 1 })

  const [formData, setFormData] = useState({})
  const [formErrorState, setformErrorState] = useState({})

  const handleChange = (event) => {
    event.persist()
    event.preventDefault()
    let { name, value } = event.target
    if (name === 'bill_zero_reading') {
      setformErrorState({
        ...formErrorState,
        bill_zero_reading: isNaN(value),
      })
    }
    setFormData((values) => {
      return { ...formData, [name]: value }
    })
  }

  const uploadDocs = (event) => {
    event.persist()
    event.preventDefault()

    // check document type is selected
    uploadService
      //.test(fileInput.current.files[0], fileInput.current.files[0].name)
      .serverUpload(fileInput.current.files[0], fileInput.current.files[0].name)
      .then((response) => {
        let fileUploadData = response.data.message
        setFormData(() => {
          return {
            ...formData,
            photo_url: fileUploadData.path,
          }
        })
      })
      .catch((err) => {
        setVisible(true)
        setErrorMessage(`Error: ${err.message}`)
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const form = event.currentTarget
    console.log('formErrorState', formErrorState)

    if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
    } else {
      console.log(formData)

      MeterService.create(formData)
        .then((res) => {
          setFormData({})

          setValidated(false)
          setVisible(true)
          setSuccessMessage('Success: Meter onboarded successfully ')
          setErrorMessage('')
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
  }

  useEffect(() => {
    const { geolocation } = navigator

    // If the geolocation is not defined in the used browser we handle it as an error
    if (!geolocation) {
      setVisible(true)
      setErrorMessage('Geolocation is not supported.')
      return
    }

    // Call Geolocation API
    geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        if (!formData.latitude || !formData.longitude) {
          setFormData((values) => {
            return { ...formData, latitude, longitude }
          })
        }
      },
      (error) => {
        setVisible(true)
        setErrorMessage(error.message)
      },
      { timeout: 1000 * 60 * 1 },
    )
  }, [formData])

  return (
    <CRow>
      <CCol xs={12}>
        <CAlert
          color={errorMessage ? 'danger' : 'success'}
          dismissible
          visible={visible}
          onClose={() => setVisible(false)}
        >
          {errorMessage ? errorMessage : successMessage}
        </CAlert>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Meter</strong> <small>Onboard</small>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              <CRow>
                <div className="mb-3">
                  <CFormLabel htmlFor="meternumber">Meter Number</CFormLabel>
                  <CFormInput
                    id="number"
                    name="number"
                    feedbackInvalid="Please enter a valid meter number."
                    required
                    onChange={handleChange}
                    value={formData.number || ''}
                    maxLength={15}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="bill_zero_reading">Bill Zero reading</CFormLabel>
                  <CFormInput
                    id="bill_zero_reading"
                    name="bill_zero_reading"
                    feedbackInvalid="Please enter a valid reading."
                    required
                    onChange={handleChange}
                    value={formData.bill_zero_reading || ''}
                    maxLength={10}
                    invalid={formErrorState.bill_zero_reading || false}
                    valid={!formErrorState.bill_zero_reading || true}
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="latitude">GPS Co-ordinates</CFormLabel>
                  <CInputGroup className="mb-3">
                    <CFormInput
                      id="latitude"
                      name="latitude"
                      placeholder="Latitude"
                      onChange={handleChange}
                      value={formData.latitude || ''}
                      required
                    />
                    <CFormInput
                      id="longitude"
                      name="longitude"
                      placeholder="Longitude"
                      required
                      onChange={handleChange}
                      value={formData.longitude || ''}
                    />
                  </CInputGroup>
                  {/* {error ? <label color="danger">{error}</label> : ''} */}
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="address">Meter Photo</CFormLabel>
                  <CFormInput
                    size="lg"
                    type="file"
                    id="billpicture"
                    class="form-control"
                    feedbackInvalid="Select valid file"
                    ref={fileInput}
                    required
                    onChange={uploadDocs}
                  />
                </div>
              </CRow>

              <CRow class="p-3">
                <CCol xs={6}>
                  <CButton className="px-4" type="submit">
                    Submit
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateMeter
