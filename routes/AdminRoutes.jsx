// Just export an array of <Route> elements directly
import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '../Layouts/AdminLayout';
import Dashboard from '../pages/Admin/Dashboard';
import Students from '../pages/Admin/Students';
import StudentCreate from '../pages/Admin/StudentCreate';
import StudentDetail from '../pages/Admin/StudentDetail';
import Teachers from '../pages/Admin/Teachers';
import TeacherCreate from '../pages/Admin/TeacherCreate';
import Classes from '../pages/Admin/Classes';
import Courses from '../pages/Admin/Courses';
import Users from '../pages/Admin/Users';
import TeachersAttendance from '../pages/Admin/TeachersAttendance';
import Report from '../pages/Admin/Report';
import Module from '../pages/Admin/Module';

const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="students" element={<Students />} />
    <Route path="students/create" element={<StudentCreate />} />
    <Route path="students/:id" element={<StudentDetail />} />
    <Route path="teachers" element={<Teachers />} />
    <Route path="teachers/create" element={<TeacherCreate />} />
    <Route path="classes" element={<Classes />} />
    <Route path="courses" element={<Courses />} />
    <Route path="courses/:courseId/modules" element={<Module />}/>
    <Route path="users" element={<Users />} />
    <Route path="teachers_attendance" element={<TeachersAttendance />} />
    <Route path="report" element={<Report />} />
  </Route>
);

export default AdminRoutes;
