import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './SidebarLayout'
import CustomAlert from './Alert'
import { useSelector } from 'react-redux'

export default function Layout() {

  const alert = useSelector((state) => state.alert)

  return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-3" style={{ marginLeft: '260px' }}>
          <CustomAlert/>
          <Outlet/>
        </div>
    </div>
  )
}
