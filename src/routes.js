import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Yogesh route
const AllCustomer = React.lazy(() => import('./views/customer/AllCustomer'))
const CreateCustomer = React.lazy(() => import('./views/customer/CreateCustomer'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/customer', name: 'Customer', element: AllCustomer },
  { path: '/customer/create', name: 'Customer Create', element: CreateCustomer },

  //// old
]

export default routes
