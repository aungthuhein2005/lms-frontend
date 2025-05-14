import React from 'react';
import { Container, Card, Button, Row, Col, Badge } from 'react-bootstrap';

const exams = [
  {
    id: 1,
    name: 'Midterm Exam',
    subject: 'Math',
    date: '2025-05-20',
    time: '10:00 AM',
    duration: '90 mins',
    status: 'Upcoming',
  },
  {
    id: 2,
    name: 'Grammar Quiz',
    subject: 'English',
    date: '2025-05-10',
    time: '1:00 PM',
    duration: '45 mins',
    status: 'Completed',
  },
  {
    id: 3,
    name: 'Science Final',
    subject: 'Science',
    date: '2025-05-22',
    time: '2:00 PM',
    duration: '120 mins',
    status: 'Upcoming',
  }
];

function Exams() {
  return (
    <Container className="">
      <h2 className="mb-4 ">My Exams</h2>
      <Row>
        {exams.map((exam) => (
          <Col md={6} lg={4} key={exam.id} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{exam.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{exam.subject}</Card.Subtitle>
                <Badge bg={exam.status === 'Completed' ? 'secondary' : 'info'} className="mb-3">
                  {exam.status}
                </Badge>
                <Card.Text>
                  <strong>Date:</strong> {exam.date} <br />
                  <strong>Time:</strong> {exam.time} <br />
                  <strong>Duration:</strong> {exam.duration}
                </Card.Text>
                <Button variant="primary" onClick={() => alert(`Starting ${exam.name}`)} disabled={exam.status === 'Completed'}>
                    Start Exam
                  </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Exams;
