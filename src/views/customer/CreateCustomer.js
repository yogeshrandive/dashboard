import React, { useState, useRef, useEffect } from 'react'
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
  CListGroup,
  CListGroupItem,
} from '@coreui/react'

import CustomerService from './../../services/customer.service'
import uploadService from './../../services/upload.service'
import publicService from './../../services/public.service'

function CreateCustomer() {
  const [visible, setVisible] = useState(false)
  const [validated, setValidated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formErrorState, setformErrorState] = useState({})
  const [documentData, setDocumentData] = useState([])

  const [formData, setFormData] = useState({
    pictures: [],
  })

  const fileInput = useRef()

  useEffect(() => {
    // get assign meter for customer
    publicService
      .getDocuemtTypes()
      .then((result) => {
        if (result.data.status === 'success') {
          setDocumentData(result.data.message)
        } else setErrorMessage(result.message)
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })
  }, [])

  const handleChange = (event) => {
    event.persist()

    let { name, value } = event.target

    if (name === 'mobile') {
      setformErrorState(() => {
        return {
          ...formErrorState,
          mobile: !/^\d{10}$/.test(value),
        }
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
    if (!formData.doctype || formData.doctype === '0') {
      setVisible(true)
      setErrorMessage('Error: Select Document type')
    } else {
      uploadService
        // .test(fileInput.current.files[0], fileInput.current.files[0].name)
        .serverUpload(fileInput.current.files[0], fileInput.current.files[0].name)
        .then((response) => {
          console.log('response.data.message', response.data.message)
          let fileUploadData = response.data.message
          let oldpictures = formData.pictures
          oldpictures.push({
            id_type: formData.doctype,
            filename: fileUploadData.filename,
            s3_url: fileUploadData.path,
          })

          setFormData(() => {
            return {
              ...formData,
              pictures: oldpictures,
            }
          })
          // console.log('formData', formData)

          fileInput.current.value = ''
        })
        .catch((err) => {
          setVisible(true)
          setErrorMessage(`Error: ${err.message}`)
        })
    }
  }

  const validateDocType = (event) => {
    if (!formData.doctype || formData.doctype === '0') {
      setVisible(true)
      setErrorMessage('Error: Select Document type')
      event.preventDefault()
    }
  }

  const removePicture = (key) => {
    let oldpictures = formData.pictures
    delete oldpictures[key]

    setFormData(() => {
      return {
        ...formData,
        pictures: oldpictures,
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const form = event.currentTarget
    console.log('formErrorState', formErrorState)

    if (!formData.pictures || formData.pictures.length === 0) {
      setVisible(true)
      setErrorMessage('Error: Upload at least one document.')
    } else if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
    } else {
      console.log(formData)
      CustomerService.saveCustomer(formData)
        .then((res) => {
          setFormData({})

          setValidated(false)
          setVisible(true)
          setSuccessMessage('Success: Customer created successfully ')
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

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Customer</strong> <small>Onboard</small>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              <CRow>
                <div className="mb-3">
                  <CFormLabel htmlFor="firstname">First Name</CFormLabel>
                  <CFormInput
                    id="firstname"
                    name="firstname"
                    feedbackInvalid="Please enter a valid first name."
                    required
                    onChange={handleChange}
                    value={formData.firstname || ''}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="lastname">Last Name</CFormLabel>
                  <CFormInput
                    id="lastname"
                    name="lastname"
                    feedbackInvalid="Please enter a valid last name."
                    required
                    onChange={handleChange}
                    value={formData.lastname || ''}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="email">Email</CFormLabel>
                  <CFormInput
                    type="email"
                    id="email"
                    name="email"
                    feedbackInvalid="Please enter a valid Email Id."
                    required
                    onChange={handleChange}
                    value={formData.email || ''}
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="mobile">mobile</CFormLabel>
                  <CFormInput
                    id="mobile"
                    name="mobile"
                    feedbackInvalid="Please enter a valid mobile."
                    onChange={handleChange}
                    value={formData.mobile || ''}
                    invalid={formErrorState.mobile || false}
                    valid={!formErrorState.mobile || true}
                    pattern="[1-9]{1}[0-9]{9}"
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="address">Address</CFormLabel>
                  <CFormTextarea
                    id="address"
                    name="address"
                    rows="3"
                    required
                    feedbackInvalid="Please enter a valid address."
                    onChange={handleChange}
                    value={formData.address || ''}
                  ></CFormTextarea>
                </div>
              </CRow>
              <CRow>
                <CFormLabel htmlFor="address">Documents</CFormLabel>
                <CListGroup>
                  {formData.pictures
                    ? formData.pictures.map((data, index) => {
                        return (
                          <CListGroupItem
                            key={index}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <a href={data.s3_url} target="_blank" rel="noreferrer">
                              {data.filename}
                            </a>
                            <CButton
                              color="link"
                              shape="rounded-0"
                              // key={index}
                              onClick={() => {
                                removePicture(index)
                              }}
                            >
                              Delete
                            </CButton>
                          </CListGroupItem>
                        )
                      })
                    : ''}
                </CListGroup>
              </CRow>

              <CRow xs="auto">
                <div className="input-group  gap-3">
                  <CCol md={4} sx={12}>
                    <CFormSelect
                      size="lg"
                      name="doctype"
                      onChange={handleChange}
                      value={formData.doctype}
                    >
                      <option key="0" value="0">
                        File Type
                      </option>
                      {documentData.length > 0
                        ? documentData.map((data, index) => {
                            return (
                              <option key={index + 1} value={data.id} title={data.title}>
                                {data.title}
                              </option>
                            )
                          })
                        : ''}
                    </CFormSelect>
                  </CCol>
                  <CCol md={6} sx={12}>
                    <CFormInput
                      size="lg"
                      type="file"
                      id="documentfile"
                      class="form-control"
                      feedbackInvalid="Select valid file"
                      ref={fileInput}
                      onClick={validateDocType}
                      onChange={uploadDocs}
                    />
                  </CCol>
                </div>
              </CRow>

              <CRow class="p-3">
                <CCol xs={6}>
                  <CButton className="px-4" type="submit">
                    Submit
                  </CButton>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CAlert
                    color={errorMessage ? 'danger' : 'success'}
                    dismissible
                    visible={visible}
                    onClose={() => setVisible(false)}
                  >
                    {errorMessage ? errorMessage : successMessage}
                  </CAlert>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateCustomer
