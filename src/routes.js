import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Yogesh route
const AllCustomer = React.lazy(() => import('./views/customer/AllCustomer'))
const CreateCustomer = React.lazy(() => import('./views/customer/CreateCustomer'))
const EditCustomer = React.lazy(() => import('./views/customer/EditCustomer'))

const AllMeter = React.lazy(() => import('./views/meter/AllMeter'))
const CreateMeter = React.lazy(() => import('./views/meter/CreateMeter'))
const EditMeter = React.lazy(() => import('./views/meter/EditMeter'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  ///  customers
  { path: '/customer', name: 'Customers', element: AllCustomer },
  { path: '/customer/create', name: 'Create', element: CreateCustomer },
  { path: '/customer/edit/:id', name: 'Edit', element: EditCustomer },
  ///  Meters
  { path: '/meter', name: 'Meters', element: AllMeter },
  { path: '/meter/create', name: 'Create', element: CreateMeter },
  { path: '/meter/edit/:id', name: 'Edit', element: EditMeter },
]

export default routes
