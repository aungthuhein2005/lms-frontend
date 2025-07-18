import React from 'react'
import Sidebar from '../components/SidebarLayout'
import CustomAlert from '../components/Alert'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

export default function TeacherLayout() {
    const alert = useSelector((state) => state.alert)

    const tabs = [
  { name: 'Dashboard', path: '/teacher', icon: <i className="bx bxs-home" style={{ fontSize: 20 }}></i> },
  { name: 'Profile', path: '/teacher/profile', icon: <i className="bx bxs-user" style={{ fontSize: 20 }}></i> },
  { name: 'Courses', path: '/teacher/courses', icon: <i className="bx bxs-book-alt" style={{ fontSize: 20 }}></i> },
  { name: 'Classes', path: '/teacher/classes', icon: <i className="bx bxs-book-alt" style={{ fontSize: 20 }}></i> },
  // { name: 'Timetable', path: '/teacher/timetable', icon: <i className="bx bxs-calendar" style={{ fontSize: 20 }}></i> },
  { name: 'Manage Assignments', path: '/teacher/assignments', icon: <i className="bx bxs-pencil" style={{ fontSize: 20 }}></i> },
  // { name: 'Grading', path: '/teacher/grades', icon: <i className="bx bxs-bar-chart-alt-2" style={{ fontSize: 20 }}></i> },
  { name: 'Manage Exams', path: '/teacher/exams', icon: <i className="bx bxs-edit" style={{ fontSize: 20 }}></i> },
  // { name: 'Reports', path: '/teacher/reports', icon: <i className="bx bxs-report" style={{ fontSize: 20 }}></i> },
  { name: "Students' Attendance", path: '/teacher/student_attendance', icon: <i className="bx bxs-check-circle" style={{ fontSize: 20 }}></i> },
  { name: 'Logout', path: '/logout', icon: <i className="bx bx-log-out" style={{ fontSize: 20 }}></i> }
];

      const role = 'teacher'

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
