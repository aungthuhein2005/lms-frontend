import React from 'react'
import Sidebar from '../components/SidebarLayout'
import CustomAlert from '../components/Alert'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

export default function StudentLayout() {
    const alert = useSelector((state) => state.alert)

    const tabs = [
  { name: 'Home', path: '/student', icon: <i className="bx bxs-home" style={{ fontSize: 20 }}></i> },
  { name: 'Profile', path: '/student/profile', icon: <i className="bx bxs-user" style={{ fontSize: 20 }}></i> },
  { name: 'My Classes', path: '/student/classes', icon: <i className="bx bxs-book-alt" style={{ fontSize: 20 }}></i> },
  { name: 'Timetable', path: '/student/timetable', icon: <i className="bx bxs-calendar" style={{ fontSize: 20 }}></i> },
  { name: 'Assignments', path: '/student/assignments', icon: <i className="bx bxs-pencil" style={{ fontSize: 20 }}></i> },
  { name: 'Grades', path: '/student/grades', icon: <i className="bx bxs-bar-chart-alt-2" style={{ fontSize: 20 }}></i> },
  { name: 'Exams', path: '/student/exams', icon: <i className="bx bxs-edit" style={{ fontSize: 20 }}></i> },
 
  { name: 'Attendance', path: '/student/attendances', icon: <i className="bx bxs-check-circle" style={{ fontSize: 20 }}></i> },
  { name: 'Settings', path: '/student/settings', icon: <i className="bx bxs-cog" style={{ fontSize: 20 }}></i> },
  { name: 'Logout', path: '/logout', icon: <i className="bx bx-log-out" style={{ fontSize: 20 }}></i> }
];

        // { name: 'Teachers', path: '/student/teachers', icon: <i className="bx bxs-book-reader" style={{ fontSize: 20 }}></i> },
        // { name: 'Courses', path: '/student/courses', icon: <i className="bx bxs-book-alt" style={{ fontSize: 20 }}></i> },
        // { name: 'Students', path: '/student/students', icon: <i className='bx bx-male-female' style={{ fontSize: 20 }}></i> },
        // { name: 'Classes', path: '/student/classes', icon: <i className="bx bxs-directions" style={{ fontSize: 20 }}></i> },
        // { name: "Teacher's Attendance", path: '/admin/teachers_attendance', icon: <i className="bx bxs-select-multiple" style={{ fontSize: 20 }}></i> },
        // { name: 'Report', path: '/admin/report', icon: <i className="bx bxs-report" style={{ fontSize: 20 }}></i> },
      

      const role = 'student'

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
