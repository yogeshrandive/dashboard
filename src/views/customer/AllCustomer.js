import React, { useState, useEffect } from 'react'
import { Navigate, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { cilPen } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CNavLink,
  CButton,
} from '@coreui/react'

import CustomerService from './../../services/customer.service'
import EventBus from './../../common/EventBus'

function AllCustomer() {
  const { isLoggedIn } = useSelector((state) => {
    return state.auth
  })
  const [content, setContent] = useState(null)

  useEffect(() => {
    CustomerService.getAllCustomers().then(
      (response) => {
        console.log(response)
        if (response.data) setContent(response.data.message)
        else setContent(null)
      },
      (error) => {
        const responseMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()

        setContent(null)

        if (responseMessage === 'Unauthorized' || error.response.status === 401) {
          console.log('Adasda')
          EventBus.dispatch('logout')
        }
      },
    )
  }, [])

  if (!isLoggedIn) return <Navigate to="/login" />

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Customers</strong>
          </CCardHeader>
          <CCardBody>
            <CTable striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" className="text-center">
                    #
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Email</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col" className="text-center">
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {content ? (
                  content.map((listValue, index) => {
                    return (
                      <CTableRow key={index}>
                        <CTableHeaderCell scope="row" className="text-center">
                          {index + 1}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {listValue.firstname} {listValue.lastname}
                        </CTableDataCell>
                        <CTableDataCell>{listValue.mobile_number}</CTableDataCell>
                        {/* <CTableDataCell>{listValue.email}</CTableDataCell> */}
                        <CTableDataCell className="text-center">
                          <CNavLink to={'/customer/edit/' + listValue.id} component={NavLink}>
                            <CIcon icon={cilPen}></CIcon>
                          </CNavLink>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })
                ) : (
                  <CTableRow>
                    <CTableHeaderCell scope="row">#</CTableHeaderCell>
                    <CTableDataCell colSpan="4">No Customer available</CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AllCustomer
