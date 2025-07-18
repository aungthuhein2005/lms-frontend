import React from "react";
import { Container, Card, Button, Row, Col, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const exams = [
//   {
//     id: 1,
//     name: "Midterm Exam",
//     subject: "Math",
//     date: "2025-05-20",
//     time: "10:00 AM",
//     duration: "90 mins",
//     status: "Upcoming",
//   },
//   {
//     id: 2,
//     name: "Grammar Quiz",
//     subject: "English",
//     date: "2025-05-10",
//     time: "1:00 PM",
//     duration: "45 mins",
//     status: "Completed",
//   },
//   {
//     id: 3,
//     name: "Science Final",
//     subject: "Science",
//     date: "2025-05-22",
//     time: "2:00 PM",
//     duration: "120 mins",
//     status: "Upcoming",
//   },
// ];

function Exams() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  async function fetchExams() {
    await axios
      .get(`http://localhost:8080/exams/all`)
      .then((response) => setExams(response.data));
  }
  return (
    <Container className="">
      <h2 className="mb-4 ">My Exams</h2>
      <Row>
        {exams.map((exam) => (
          <Col md={6} lg={4} key={exam.id} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{exam.title}</Card.Title>
                <Badge
                  bg={exam.status === "Completed" ? "secondary" : "info"}
                  className="mb-3"
                >
                  {exam.status}
                </Badge>
                <Card.Text>
                  <strong>Description:</strong> {exam.description} <br />
                  <strong>Duration:</strong> {exam.duration} <br />
                  <strong>Score:</strong> {exam.score}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/student/exams/${exam.id}/attempt`)}
                  disabled={exam.status === "Completed"}
                >
                  Attempt
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
