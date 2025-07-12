import React from 'react'
import Sidebar from '../components/SidebarLayout'
import CustomAlert from '../components/Alert'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

export default function TeacherLayout() {
    const alert = useSelector((state) => state.alert)

    const tabs = [
  { name: 'Dashboard', path: '/teacher', icon: <i className="bx bxs-home" style={{ fontSize: 20 }}></i> },
  { name: 'Profile Settings', path: '/teacher/profile', icon: <i className="bx bxs-user" style={{ fontSize: 20 }}></i> },
  { name: 'Courses', path: '/teacher/courses', icon: <i className="bx bxs-book-alt" style={{ fontSize: 20 }}></i> },
  { name: 'Classes', path: '/teacher/classes', icon: <i className="bx bxs-book-alt" style={{ fontSize: 20 }}></i> },
  { name: 'Timetable', path: '/teacher/timetable', icon: <i className="bx bxs-calendar" style={{ fontSize: 20 }}></i> },
  { name: 'Manage Assignments', path: '/teacher/assignments', icon: <i className="bx bxs-pencil" style={{ fontSize: 20 }}></i> },
  { name: 'Grading & Progress', path: '/teacher/grades', icon: <i className="bx bxs-bar-chart-alt-2" style={{ fontSize: 20 }}></i> },
  { name: 'Manage Exams', path: '/teacher/exams', icon: <i className="bx bxs-edit" style={{ fontSize: 20 }}></i> },
  { name: 'Student Attendance', path: '/teacher/attendances', icon: <i className="bx bxs-check-circle" style={{ fontSize: 20 }}></i> },
  { name: 'Reports', path: '/teacher/reports', icon: <i className="bx bxs-report" style={{ fontSize: 20 }}></i> },
  { name: 'Logout', path: '/logout', icon: <i className="bx bx-log-out" style={{ fontSize: 20 }}></i> }
];

        // { name: 'Teachers', path: '/student/teachers', icon: <i className="bx bxs-book-reader" style={{ fontSize: 20 }}></i> },
        // { name: 'Courses', path: '/student/courses', icon: <i className="bx bxs-book-alt" style={{ fontSize: 20 }}></i> },
        // { name: 'Students', path: '/student/students', icon: <i className='bx bx-male-female' style={{ fontSize: 20 }}></i> },
        // { name: 'Classes', path: '/student/classes', icon: <i className="bx bxs-directions" style={{ fontSize: 20 }}></i> },
        // { name: "Teacher's Attendance", path: '/admin/teachers_attendance', icon: <i className="bx bxs-select-multiple" style={{ fontSize: 20 }}></i> },
        // { name: 'Report', path: '/admin/report', icon: <i className="bx bxs-report" style={{ fontSize: 20 }}></i> },
      

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
