import React from 'react';
import { Card, Row, Col, ProgressBar, ListGroup, Alert, Button, Table } from 'react-bootstrap';

export default function Dashboard() {
  const courses = [
    { title: "Mathematics", progress: 75 },
    { title: "Science", progress: 40 },
    { title: "History", progress: 90 },
  ];

  const assignments = [
    { title: "Math Quiz 3", due: "May 15, 2025" },
    { title: "Science Project", due: "May 18, 2025" },
  ];

  const schedule = [
    { day: "Monday", time: "9:00 AM - 10:00 AM", subject: "Mathematics", teacher: "Mr. Smith" },
    { day: "Tuesday", time: "10:00 AM - 11:00 AM", subject: "Science", teacher: "Ms. Johnson" },
    { day: "Wednesday", time: "11:00 AM - 12:00 PM", subject: "History", teacher: "Mr. Lee" },
    { day: "Thursday", time: "9:00 AM - 10:00 AM", subject: "Mathematics", teacher: "Mr. Smith" },
    { day: "Friday", time: "10:00 AM - 11:00 AM", subject: "Science", teacher: "Ms. Johnson" },
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Welcome back, Teacher!</h2>

      {/* Alert Section */}
      <Alert variant="info">
        Don't forget to submit your Science Project by <strong>May 18</strong>.
      </Alert>

      {/* Courses Progress */}
      <h4>Your Classes</h4>
      <Row>
        {courses.map((course, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>
                    <span className='text-muted'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio laboriosam doloremque saepe voluptates repellendus. 
                    </span>
                </Card.Text>
                
                <ProgressBar now={course.progress} label={`${course.progress}%`} />
                <div className='pt-2 flex item-end'>
                    <Button variant="primary" className="mt-2">
                        Details
                    </Button>
                </div>
              </Card.Body>
              
            </Card>
          </Col>
        ))}
      </Row>

      {/* Upcoming Assignments */}
      <h4 className="mt-4">Upcoming Assignments</h4>
      <ListGroup>
        {assignments.map((a, index) => (
          <ListGroup.Item key={index}>
            <strong>{a.title}</strong> - Due: {a.due}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Attendance Summary */}
      <h4 className="mt-4">Attendance</h4>
      <Card>
        <Card.Body>
          <p><strong>Present:</strong> 45 classes</p>
          <p><strong>Absent:</strong> 3 classes</p>
          <p><strong>Attendance Rate:</strong> 93%</p>
        </Card.Body>
      </Card>

      {/* Class Schedule */}
      <h4 className="mt-4">Class Schedule</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Day</th>
            <th>Time</th>
            <th>Subject</th>
            <th>Teacher</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index}>
              <td>{item.day}</td>
              <td>{item.time}</td>
              <td>{item.subject}</td>
              <td>{item.teacher}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
