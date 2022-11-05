import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

import {
  CButton,
  CRow,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CAlert,
  CCol,
  CListGroup,
  CListGroupItem,
  CAccordionItem,
  CAccordion,
  CAccordionHeader,
  CAccordionBody,
  CCard,
  CCardTitle,
  CCardLink,
} from '@coreui/react'

import CustomerService from './../../services/customer.service'
import MeterService from './../../services/meter.service'
import uploadService from './../../services/upload.service'
import publicService from './../../services/public.service'

function EditCustomer() {
  const { id } = useParams()
  const fileInput = useRef()

  const [visible, setVisible] = useState(false)
  const [visibleMeter, setVisibleMeter] = useState(false)
  const [validated, setValidated] = useState(false)
  const [validatedMeter, setValidatedMeter] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorMessageMeter, setErrorMessageMeter] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [successMessageMeter, setSuccessMessageMeter] = useState('')
  const [formErrorState, setformErrorState] = useState({})
  const [formData, setFormData] = useState({})
  const [formDataMeter, setformDataMeter] = useState({})
  const [documentData, setDocumentData] = useState([])
  const [meterDropdown, setMeterDropdown] = useState([])
  const [consumerData, setConsumerData] = useState([])

  useEffect(() => {
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

    // get customer Details
    CustomerService.getById(id)
      .then((result) => {
        // console.log(result.data.message)
        if (result.data.status === 'success') {
          setFormData((values) => {
            return { ...formData, ...result.data.message }
          })

          console.log('formData', formData)
        } else setErrorMessage(result.message)
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })

    // Get active meter for dropdown
    MeterService.getActiveMeter()
      .then((result) => {
        if (result.data.status === 'success') {
          console.log('Asdas', result.data.message)
          setMeterDropdown(result.data.message)

          console.log('meter', meterDropdown)
        } else setErrorMessage(result.message)
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })

    // get assign meter for customer
    CustomerService.getAssignMeter(id)
      .then((result) => {
        if (result.data.status === 'success') {
          setConsumerData(result.data.message)

          console.log('setMeterDropdown(result.data.message)', consumerData)
        } else setErrorMessage(result.message)
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })
  }, [id])

  const handleChange = (event) => {
    event.persist()

    let { name, value } = event.target
    setFormData((values) => {
      return { ...formData, [name]: value }
    })
  }

  const removePicture = (key) => {
    console.log(key)
    let oldpictures = formData.pictures
    oldpictures.splice(key, 1)
    console.log('oldpictures', oldpictures)
    setFormData(() => {
      return {
        ...formData,
        pictures: oldpictures,
      }
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
          let fileUploadData = response.data.message
          let oldpictures = formData.pictures
          oldpictures.push({
            id_type: parseInt(formData.doctype),
            filename: fileUploadData.filename,
            s3_url: fileUploadData.path,
          })

          setFormData(() => {
            return {
              ...formData,
              pictures: oldpictures,
            }
          })
          console.log('formData', formData)

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

  const handleSubmit = (event) => {
    event.preventDefault()

    const form = event.currentTarget
    console.log('formErrorState', formErrorState)
    console.log(formData.pictures)
    console.log(formData.pictures.length)
    if (!formData.pictures || formData.pictures.length === 0) {
      console.log('asdasd')
      setVisible(true)
      setErrorMessage('Error: Upload at least one document.')
    } else if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
    } else {
      console.log(formData)
      CustomerService.update(id, formData)
        .then((res) => {
          setValidated(false)
          setVisible(true)
          setSuccessMessage('Success: Customer updated successfully ')
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

          setValidated(false)
          setVisible(true)
          setErrorMessage(`Error: ${message}`)
        })
    }
  }

  const handleChangeMeter = (event) => {
    event.persist()

    let { name, value } = event.target
    setformDataMeter((values) => {
      return { ...formDataMeter, [name]: value }
    })
  }

  const handleSubmitMeter = (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidatedMeter(true)
    } else {
      console.log(formDataMeter)
      MeterService.assignMeter(formDataMeter.meter, id)
        .then((res) => {
          setValidatedMeter(false)
          setVisibleMeter(true)
          setSuccessMessageMeter('Success: Meter assign to customer successfully ')
          setErrorMessageMeter('')
        })
        .catch((error) => {
          let message = ''
          if (error.code === 'ERR_NETWORK') message = error.message
          else
            message =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString() ||
              'Server Error'

          setValidatedMeter(false)
          setVisibleMeter(true)
          setErrorMessageMeter(`Error: ${message}`)
        })
    }
  }

  return (
    <div>
      <CAccordion activeItemKey={1}>
        <CAccordionItem itemKey={1}>
          <CAccordionHeader>Customer Details</CAccordionHeader>
          <CAccordionBody>
            <CRow>
              <CCol xs={12}>
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
                          name="mobile_number"
                          feedbackInvalid="Please enter a valid mobile."
                          value={formData.mobile_number || ''}
                          maxLength={10}
                          readOnly
                          disabled
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
                                    {documentData.find((a) => a.id === data.id_type).title ||
                                      data.s3_url}
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
              </CCol>
            </CRow>
          </CAccordionBody>
        </CAccordionItem>
        <CAccordionItem itemKey={2}>
          <CAccordionHeader>Meter Details</CAccordionHeader>
          <CAccordionBody>
            <CRow xs="auto">
              <CCol>
                <CCardBody>
                  <CForm noValidate validated={validatedMeter} onSubmit={handleSubmitMeter}>
                    <CRow xs="auto">
                      <CFormLabel htmlFor="address">Assign Meter to customer</CFormLabel>

                      <CCol sm={12} md={6}>
                        <CFormSelect
                          size="lg"
                          name="meter"
                          onChange={handleChangeMeter}
                          value={formDataMeter.meter || ''}
                          required
                          feedbackInvalid="Please select the meter number."
                        >
                          <option key="0" value="">
                            Select Meter
                          </option>
                          {meterDropdown.length > 0
                            ? meterDropdown.map((data, index) => {
                                return (
                                  <option key={index + 1} value={data.id} title={data.number}>
                                    {data.number}
                                  </option>
                                )
                              })
                            : ''}
                        </CFormSelect>
                      </CCol>
                      <CCol sm={12} md={4}>
                        <CButton type="submit" color="primary">
                          Assign
                        </CButton>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CAlert
                          color={errorMessageMeter ? 'danger' : 'success'}
                          dismissible
                          visible={visibleMeter}
                          onClose={() => setVisibleMeter(false)}
                        >
                          {errorMessageMeter ? errorMessageMeter : successMessageMeter}
                        </CAlert>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CCard className="mb-4">
                  {consumerData && consumerData.length > 0
                    ? consumerData.map((element, index) => {
                        return (
                          <CCardBody key={index}>
                            <CCardTitle>
                              {index + 1}. Meter (<small># {element.meter.number}</small>)
                            </CCardTitle>

                            <CListGroup>
                              <CListGroupItem>
                                <strong>Consumer Number</strong> : {element.number}
                              </CListGroupItem>
                              <CListGroupItem>
                                <strong>Meter Number</strong> : {element.meter.number}
                              </CListGroupItem>
                              <CListGroupItem>
                                <strong>Bill Zero Reading</strong> :
                                {element.meter.bill_zero_reading}
                              </CListGroupItem>
                            </CListGroup>
                            <CListGroup layout="horizontal-sm">
                              <CListGroupItem>
                                <strong>Longitude</strong> : {element.meter.latitude}
                              </CListGroupItem>
                              <CListGroupItem>
                                <strong>Latitude</strong> : {element.meter.longitude}
                              </CListGroupItem>
                              <CListGroupItem>
                                <strong>Photo URL</strong> :{' '}
                                <a href={element.meter.longitude} target="_blank" rel="noreferrer">
                                  {element.meter.photo_url}
                                </a>
                              </CListGroupItem>
                            </CListGroup>

                            <CCardLink href="#">Remove</CCardLink>
                          </CCardBody>
                        )
                      })
                    : ''}
                </CCard>
              </CCol>
            </CRow>
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </div>
  )
}

export default EditCustomer
