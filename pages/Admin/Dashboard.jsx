
import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Spinner, Alert, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// Removed RTK Query imports as we will use mock data
// import {
//   useGetUsersQuery,
//   useGetTeachersQuery,
//   useGetClassesQuery,
//   useGetRecentClassesQuery,
//   useGetCoursesQuery,
// } from '../../features/api/userApiSlice';


import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useGetUsersQuery } from '../../features/api/userApiSlice';
import { useGetTeachersQuery } from '../../features/api/teacherApiSlice';
import { useGetClassesQuery, useGetRecentClassesQuery } from '../../features/api/classApiSlice';
import { useGetCoursesQuery } from '../../features/api/courseApiSlice';
import { useGetClassCountBySemesterIdQuery, useGetClassProgressQuery, useGetStudentPerAcademicYearQuery } from '../../features/api/adminDashboardApiSlice';
import { useGetAcademicYearsQuery } from '../../features/api/academicYearApiSlice';
import { useGetSemestersByAcademicYearIdQuery } from '../../features/api/semesterServiceApiSlice';

export default function Dashboard() {
  // --- Mock Data for Demonstration ---
  // Replaced RTK Query hooks with hardcoded mock data

  // For Class Progress Overview
const [progressYear, setProgressYear] = useState(1);
const [progressSemester, setProgressSemester] = useState(1);

// For Class Student Count By Semester
const [studentCountYear, setStudentCountYear] = useState(1);
const [studentCountSemester, setStudentCountSemester] = useState(1);


  const {data:users,isLoading:usersLoading,isError:usersError} = useGetUsersQuery();
  const {data:teachers,isLoading:teachersLoading,isError:teachersError} = useGetTeachersQuery();
  const {data:classes,isLoading:classesLoading,isError:classesError} = useGetClassesQuery();
  const {data:courses,isLoading:coursesLoading,isError:coursesError} = useGetCoursesQuery();
  const {data:recentClasses,isLoading:recentClassesLoading,isError:recentClassesError} = useGetRecentClassesQuery();
  const {data:studentCountPerAcademicYear} = useGetStudentPerAcademicYearQuery();
  const {data:academicYears} = useGetAcademicYearsQuery();
  const { data: classProgress } = useGetClassProgressQuery(progressSemester);
const { data: semesterClassCount } = useGetClassCountBySemesterIdQuery(studentCountSemester);

const { data: semestersProgress } = useGetSemestersByAcademicYearIdQuery(progressYear);
const { data: semestersCount } = useGetSemestersByAcademicYearIdQuery(studentCountYear);
  
  
  
  const isLoading = usersLoading || teachersLoading || classesLoading || coursesLoading || recentClassesLoading;
  const isError = usersError || teachersError || classesError || coursesError || recentClassesError;


    if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </Spinner>
        <p className="mt-2 text-muted">Loading dashboard data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger text-center my-5" role="alert">
        Failed to load dashboard data. Please try again later.
      </div>
    );
  }

  const academicYearStudentCountsData = [
  { academicYear: '2021-2022', studentCount: 120 },
  // { academicYear: '2022-2023', studentCount: 150 },
  // { academicYear: '2023-2024', studentCount: 180 },
  // ... more years
];


  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    totalTeachers: teachers.length,
    totalCourses: courses.length,
    totalClasses: classes.length,
  };

  // --- Data Preparation for Charts ---

  // 1. User Distribution Data (for Pie Chart)
  // Assuming all users are either students or teachers.
  // If a teacher is also counted as a user, then students = totalUsers - totalTeachers.
  const studentCount = stats.totalUsers - stats.totalTeachers;
  const userDistributionData = [
    { name: 'Students', value: studentCount > 0 ? studentCount : 0 },
    { name: 'Teachers', value: stats.totalTeachers },
  ];
  const PIE_COLORS = ['#0088FE', '#00C49F']; // Blue for students, Green for teachers

  // 2. Classes per Semester Data (for Bar Chart)
  const classesPerSemester = classes.reduce((acc, cls) => {
    // Ensure cls.semester and cls.semester.name exist
    const semesterName = cls.semester?.name || 'Unknown Semester';
    acc[semesterName] = (acc[semesterName] || 0) + 1;
    return acc;
  }, {});
  const classesPerSemesterData = Object.keys(classesPerSemester).map(name => ({
    name,
    count: classesPerSemester[name]
  }));




  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold text-primary">📊 Admin Dashboard</h2>

      {/* Statistic Cards */}
      <Row className="mb-4 g-4"> {/* Added g-4 for consistent gutter */}
        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 text-center h-100"> {/* Added h-100 */}
            <Card.Body className="d-flex flex-column justify-content-center"> {/* Added flex for centering content */}
              <h4 className="fw-semibold text-secondary">Total Users</h4>
              <h2 className="fw-bold text-primary">{stats.totalUsers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 text-center h-100">
            <Card.Body className="d-flex flex-column justify-content-center">
              <h4 className="fw-semibold text-secondary">Total Teachers</h4>
              <h2 className="fw-bold text-warning">{stats.totalTeachers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 text-center h-100">
            <Card.Body className="d-flex flex-column justify-content-center">
              <h4 className="fw-semibold text-secondary">Total Courses</h4>
              <h2 className="fw-bold text-success">{stats.totalCourses}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 text-center h-100">
            <Card.Body className="d-flex flex-column justify-content-center">
              <h4 className="fw-semibold text-secondary">Total Classes</h4>
              <h2 className="fw-bold text-danger">{stats.totalClasses}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row className="mb-4 g-4">
        {/* User Distribution Pie Chart */}
        <Col lg={6}>
          <Card className="shadow-sm border-0 rounded-4 h-100">
            <Card.Body>
              <h5 className="fw-semibold mb-3 text-secondary">👥 User Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} users`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Classes per Semester Bar Chart */}
       <Col lg={6}>
  <Card className="shadow-sm border-0 rounded-4 h-100">
    <Card.Body>
      <h5 className="fw-semibold mb-3 text-secondary">📊 Students per Academic Year</h5>
      
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={studentCountPerAcademicYear}>
          <PolarGrid />
          <PolarAngleAxis dataKey="academicYearName" />
          <PolarRadiusAxis />
          <Tooltip />
          <Radar
            name="Student Count"
            dataKey="studentCount"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Card.Body>
  </Card>
</Col>
      </Row>

      <Row className="mb-4 g-4">
        {/* Course Progress Bar Chart (Dummy Data) */}
        <Col lg={6}>
          <Card className="shadow-sm border-0 rounded-4 h-100">
            <Card.Body>
              <div className="mb-3">
  <h5 className="fw-semibold text-secondary">📈 Class Progress Overview</h5>
  <Row className="align-items-center">
<Col md={4}>
  <label className="form-label fw-semibold">Academic Year</label>
  <select
    className="form-select"
    value={progressYear}
    onChange={(e) => setProgressYear(Number(e.target.value))}
  >
    {academicYears?.map((year) => (
      <option key={year.id} value={year.id}>{year.name}</option>
    ))}
  </select>
</Col>

<Col md={4}>
  <label className="form-label fw-semibold">Semester</label>
  <select
    className="form-select"
    value={progressSemester}
    onChange={(e) => setProgressSemester(Number(e.target.value))}
  >
    {semestersProgress?.map((sem) => (
      <option key={sem.id} value={sem.id}>{sem.name}</option>
    ))}
  </select>
</Col>

  </Row>
</div>

             
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={classProgress}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="className" angle={-15} textAnchor="end" height={60} />
                  <YAxis domain={[0, 100]} label={{ value: 'Progress (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="classProgress" fill="#8884d8" name="Average Progress" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

 <Col lg={6}>
          <Card className="shadow-sm border-0 rounded-4 h-100">
            <Card.Body>
              <div className="mb-3">
  <h5 className="fw-semibold text-secondary">📈 Class Student Count By Semester</h5>
  <Row className="align-items-center">
    <Col md={4}>
  <label className="form-label fw-semibold">Academic Year</label>
  <select
    className="form-select"
    value={studentCountYear}
    onChange={(e) => setStudentCountYear(Number(e.target.value))}
  >
    {academicYears?.map((year) => (
      <option key={year.id} value={year.id}>{year.name}</option>
    ))}
  </select>
</Col>

<Col md={4}>
  <label className="form-label fw-semibold">Semester</label>
  <select
    className="form-select"
    value={studentCountSemester}
    onChange={(e) => setStudentCountSemester(Number(e.target.value))}
  >
    {semestersCount?.map((sem) => (
      <option key={sem.id} value={sem.id}>{sem.name}</option>
    ))}
  </select>
</Col>

  </Row>
</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={semesterClassCount}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="className" angle={-15} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="studentCount" fill="#82ca9d" name="Number of Classes" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>


      </Row>


      {/* Recent Classes Table */}
      <Card className="shadow-sm border-0 rounded-4 mt-4"> {/* Added mt-4 for spacing */}
        <Card.Body>
          <h5 className="fw-semibold mb-3 text-secondary">🆕 Recent Classes</h5>
          {recentClasses.length > 0 ? (
            <Table responsive hover className="mb-0"> {/* Added mb-0 for table */}
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Class Name</th>
                  <th>Teacher</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentClasses.map((cls, idx) => (
                  <tr key={cls.id}>
                    <td>{idx + 1}</td>
                    <td>{cls.name}</td>
                    {/* Safely access nested properties */}
                    <td>{cls.teacher?.user?.name || 'N/A'}</td>
                    <td>{cls.course?.title || 'N/A'}</td>
                    <td>{cls.semester?.name || 'N/A'}</td>
                    <td className="text-end">
                      <Link to={`/admin/classes/${cls.id}`}>
                        <Button size="sm" variant="outline-success">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info" className="text-center mb-0">
              No recent classes to display.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
