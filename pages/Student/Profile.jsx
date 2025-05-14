import React from 'react';
import { Card, Row, Col, Button, ListGroup, Image, Table } from 'react-bootstrap';
import admin from '@/assets/teacher-profile.jpg';

export default function Profile() {
  const student = {
    name: "John Doe",
    email: "john.doe@student.edu",
    phone: "123-456-7890",
    gender: "Male",
    dob: "2005-06-15",
    address: "123 Main Street, Springfield",
    enrollmentYear: "2022",
    rollNumber: "STU1025",
    guardian: {
      name: "Jane Doe",
      phone: "123-456-7891",
    },
    photoUrl: admin,
    classes: [
      {
        name: "10-A",
        subject: "Mathematics",
        teacher: "Mr. Alan",
        timetableLink: "/classes/10-A/timetable"
      },
      {
        name: "10-B",
        subject: "Science",
        teacher: "Ms. Sarah",
        timetableLink: "/classes/10-B/timetable"
      }
    ]
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Student Profile</h3>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={4} className="text-center">
              <Image src={student.photoUrl} roundedCircle width={150} height={150} className='object-fit-cover border' />
              <h5 className="mt-3">{student.name}</h5>
              <p className="text-muted">Roll No: {student.rollNumber}</p>
              <Button variant="outline-primary" size="sm">Edit Profile</Button>
            </Col>

            <Col md={8}>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>Email:</strong> {student.email}</ListGroup.Item>
                    <ListGroup.Item><strong>Phone:</strong> {student.phone}</ListGroup.Item>
                    <ListGroup.Item><strong>Gender:</strong> {student.gender}</ListGroup.Item>
                    <ListGroup.Item><strong>DOB:</strong> {student.dob}</ListGroup.Item>
                    <ListGroup.Item><strong>Address:</strong> {student.address}</ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>Enrollment Year:</strong> {student.enrollmentYear}</ListGroup.Item>
                    <ListGroup.Item><strong>Roll No:</strong> {student.rollNumber}</ListGroup.Item>
                    <ListGroup.Item><strong>Guardian Name:</strong> {student.guardian.name}</ListGroup.Item>
                    <ListGroup.Item><strong>Guardian Contact:</strong> {student.guardian.phone}</ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Classes Section */}
      <Card className="shadow-sm">
        <Card.Header><strong>Enrolled Classes</strong></Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Class</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Timetable</th>
              </tr>
            </thead>
            <tbody>
              {student.classes.map((cls, idx) => (
                <tr key={idx}>
                  <td>{cls.name}</td>
                  <td>{cls.subject}</td>
                  <td>{cls.teacher}</td>
                  <td><a href={cls.timetableLink}>View</a></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
