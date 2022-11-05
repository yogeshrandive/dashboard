import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilApps, cilPlus, cilGauge, cilUser, cilUserFollow } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilApps} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavTitle,
    name: 'Customers',
  },
  {
    component: CNavItem,
    name: 'All',
    to: '/customer',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Create',
    to: '/customer/create',
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Meters',
  },
  {
    component: CNavItem,
    name: 'All',
    to: '/meter',
    icon: <CIcon icon={cilGauge} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Create',
    to: '/meter/create',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
]

export default _nav
