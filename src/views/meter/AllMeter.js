import React, { useState, useEffect } from 'react'
import { Navigate, NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPen } from '@coreui/icons'
import { useSelector } from 'react-redux'
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
} from '@coreui/react'

import MeterService from './../../services/meter.service'
import EventBus from './../../common/EventBus'

function AllMeter() {
  const { isLoggedIn } = useSelector((state) => {
    return state.auth
  })
  const [content, setContent] = useState(null)

  useEffect(() => {
    MeterService.getAll().then(
      (response) => {
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
          EventBus.dispatch('logout')
        }
      },
    )
  }, [])

  if (!isLoggedIn) return <Navigate to="/login" />

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>All Meters</strong>
      </CCardHeader>
      <CCardBody>
        <CTable align="middle" className="mb-0 border" hover responsive bordered>
          <CTableHead color="dark">
            <CTableRow className="text-center">
              <CTableHeaderCell scope="col" className="text-center">
                #
              </CTableHeaderCell>
              <CTableHeaderCell scope="col">Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Reading</CTableHeaderCell>
              <CTableHeaderCell scope="col">Consumer ID</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              {/* <CTableHeaderCell scope="col">Onboard At</CTableHeaderCell> */}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {content ? (
              content.map((listValue, index) => {
                return (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableHeaderCell scope="row" className="text-center">
                      {index + 1}
                    </CTableHeaderCell>
                    <CTableDataCell>{listValue.number}</CTableDataCell>
                    <CTableDataCell>{listValue.bill_zero_reading}</CTableDataCell>
                    <CTableDataCell>{listValue.id_consumer}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CNavLink to={'/meter/edit/' + listValue.id} component={NavLink}>
                        <CIcon icon={cilPen}></CIcon>
                      </CNavLink>
                    </CTableDataCell>
                  </CTableRow>
                )
              })
            ) : (
              <CTableRow>
                <CTableHeaderCell scope="row">#</CTableHeaderCell>
                <CTableDataCell colSpan="4">No Meter available</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default AllMeter
