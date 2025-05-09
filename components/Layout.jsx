import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './SidebarLayout'

export default function Layout() {
  return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-3" style={{ marginLeft: '260px' }}>
          <Outlet/>
        </div>
    </div>
  )
}
