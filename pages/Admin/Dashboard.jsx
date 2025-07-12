import React, { use } from 'react';
import { Card, Row, Col, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetUsersQuery } from '../../features/api/userApiSlice';
import { useGetTeachersQuery } from '../../features/api/teacherApiSlice';
import { useGetClassesQuery, useGetRecentClassesQuery } from '../../features/api/classApiSlice';
import { useGetCoursesQuery } from '../../features/api/courseApiSlice';

export default function Dashboard() {
  // Dummy data for demonstration


  const { data: users = [] } = useGetUsersQuery();
  const { data: teachers = [] } = useGetTeachersQuery();
  const { data: classes = [] } = useGetClassesQuery();
  const { data: courses = [] } = useGetCoursesQuery();
  const { data: recentClasses = [] } = useGetRecentClassesQuery();
  

    const stats = {
    totalUsers: users.length || 0,
    totalTeachers: teachers.length || 0,
    totalCourses: courses.length || 0,
    totalClasses: classes.length || 0,
  };

  // const recentClasses = [
  //   { id: 1, name: "Algebra I", teacher: "Mr. John Doe", course: "Math", semester: "Semester 1" },
  //   { id: 2, name: "World History", teacher: "Ms. Jane Smith", course: "History", semester: "Semester 2" },
  //   { id: 3, name: "Chemistry 101", teacher: "Dr. Albert", course: "Science", semester: "Semester 1" },
  // ];

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold text-primary">📊 Admin Dashboard</h2>

      {/* Statistic Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 text-center">
            <Card.Body>
              <h4 className="fw-semibold text-secondary">Users</h4>
              <h2 className="fw-bold text-primary">{stats.totalUsers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 text-center">
            <Card.Body>
              <h4 className="fw-semibold text-secondary">Teachers</h4>
              <h2 className="fw-bold text-warning">{stats.totalTeachers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 text-center">
            <Card.Body>
              <h4 className="fw-semibold text-secondary">Courses</h4>
              <h2 className="fw-bold text-success">{stats.totalCourses}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4 text-center">
            <Card.Body>
              <h4 className="fw-semibold text-secondary">Classes</h4>
              <h2 className="fw-bold text-danger">{stats.totalClasses}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Classes Table */}
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body>
          <h5 className="fw-semibold mb-3 text-secondary">🆕 Recent Classes</h5>
          <Table responsive hover>
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
                  <td>{cls.teacher.user.name}</td>
                  <td>{cls.course.title}</td>
                  <td>{cls.semester.name}</td>
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
        </Card.Body>
      </Card>

      {/* You can add Charts or Calendar here */}
    </div>
  );
}
