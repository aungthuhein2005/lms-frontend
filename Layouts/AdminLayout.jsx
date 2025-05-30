import React from 'react'
import Sidebar from '../components/SidebarLayout'
import CustomAlert from '../components/Alert'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
    const alert = useSelector((state) => state.alert)

    const tabs = [
        { name: 'Dashboard', path: '/admin', icon: <i className="bx bxs-dashboard" style={{ fontSize: 20 }}></i> },
        { name: 'Users', path: '/admin/users', icon: <i className="bx bxs-group" style={{ fontSize: 20 }}></i> },
        { name: 'Teachers', path: '/admin/teachers', icon: <i className="bx bxs-book-reader" style={{ fontSize: 20 }}></i> },
        { name: 'Courses', path: '/admin/courses', icon: <i className="bx bxs-book-alt" style={{ fontSize: 20 }}></i> },
        { name: 'Subjects', path: '/admin/subjects', icon: <i className="bx bxs-book-alt" style={{ fontSize: 20 }}></i> },
        { name: 'Students', path: '/admin/students', icon: <i className='bx bx-male-female' style={{ fontSize: 20 }}></i> },
        { name: 'Classes', path: '/admin/classes', icon: <i className="bx bxs-directions" style={{ fontSize: 20 }}></i> },
        { name: "Teacher's Attendance", path: '/admin/teachers_attendance', icon: <i className="bx bxs-select-multiple" style={{ fontSize: 20 }}></i> },
        { name: 'Report', path: '/admin/report', icon: <i className="bx bxs-report" style={{ fontSize: 20 }}></i> },
      ]

      const role = 'admin'

  return (
      <div className="d-flex">
        <Sidebar tabs={tabs} role={role} />
        <div className="flex-grow-1 p-3" style={{ marginLeft: '260px' }}>
          <CustomAlert/>
          <Outlet/>
        </div>
    </div>
  )
}
