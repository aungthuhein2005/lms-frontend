import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ProgressBar, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function Progress() {
    const {roleId: studentId} = useSelector(state=>state.auth.user);
    console.log(studentId);
    
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/progress/student-dashboard-summary`, {
          params: { studentId }
        });
        setProgressData(response.data);
        console.log(response.data);
        
      } catch (err) {
        setError(err.message || 'Error fetching progress');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchProgress();
    }
  }, [studentId]);

  const assignments = [
    { title: "Assignment 1", score: "90%", feedback: "Well done!" },
    { title: "Quiz 1", score: "75%", feedback: "Review chapter 2." },
    { title: "Assignment 2", score: "-", feedback: "Pending submission" },
  ];

  return (
    <Container className='mt-5'>
      <h2 className="fw-bold text-primary mb-4">My Progress</h2>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Progress Overview</Card.Title>
              <Card.Text>
                Track your learning journey, completed tasks, and performance metrics.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Row>
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header className="fw-bold">Courses Status</Card.Header>
              <ListGroup variant="flush">
                {progressData.map((mod, index) => (
                  <ListGroup.Item key={index}>
                    <div className="d-flex justify-content-between">
                      <div>
                        {mod.courseTitle}
                        {" "}
                        <Badge bg={
                          mod.progressPercent >= 100 ? "success" :
                          mod.progressPercent > 0 ? "warning" : "secondary"
                        }>
                          {mod.progressPercent >= 100 ? "Completed" :
                           mod.progressPercent > 0 ? "In Progress" : "Not Started"}
                        </Badge>
                      </div>
                      <div style={{ width: "40%" }}>
                        <ProgressBar now={mod.progressPercent} label={`${mod.progressPercent.toFixed(1)}%`} />
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card>
              <Card.Header className="fw-bold">Assignments & Quizzes</Card.Header>
              <ListGroup variant="flush">
                {assignments.map((a, index) => (
                  <ListGroup.Item key={index}>
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>{a.title}</strong> - {a.score}
                        <div className="text-muted small">Feedback: {a.feedback}</div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Header className="fw-bold">Time Spent</Card.Header>
            <Card.Body>
              <p><strong>Total Time:</strong> 5 hours 20 minutes</p>
              <p><strong>Average Time per Module:</strong> 1 hour 45 minutes</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
