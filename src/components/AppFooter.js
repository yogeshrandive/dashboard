import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://mvpbilling.com" target="_blank" rel="noopener noreferrer">
          MVP Billing
        </a>
        <span className="ms-1">&copy; 2022 creativeLabs.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://mvpbilling" target="_blank" rel="noopener noreferrer">
          MVP Billing Admin Dashboard
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
