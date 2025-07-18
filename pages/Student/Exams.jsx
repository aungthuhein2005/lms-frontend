import React from "react";
import { Container, Card, Button, Row, Col, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExamCard from "../../components/ExamCard";


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
    <Container className="py-5">
      <h2 className="fw-bold text-primary">My Exams</h2>
      <Row>
        {exams.map((exam) => (
          <Col md={6} lg={4} key={exam.id} className="mb-4">
            <ExamCard exam={exam}/>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Exams;