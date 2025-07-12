import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container, // Import Container for consistent layout
  Card,
  Row,
  Col,
  Badge,
  Spinner, // Import Spinner for loading indication
  Alert,
  Button, // Import Alert for error messages
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

// Centralized Axios instance (optional but good practice)
const api = axios.create({
  baseURL: "http://localhost:8080/",
});

export default function SemesterDetail() {
  const { id } = useParams();
  const [semester, setSemester] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate(); // Import useNavigate for navigation

  useEffect(() => {
    const fetchSemester = async () => {
      setIsLoading(true); // Set loading to true before fetch
      setError(null); // Clear any previous errors

      try {
        const response = await api.get(`semesters/${id}`);
        setSemester(response.data);
        console.log(response.data);
        
      } catch (err) {
        console.error("Error fetching semester data:", err);
        setError(err); // Store the error
      } finally {
        setIsLoading(false); // Set loading to false after fetch
      }
    };

    fetchSemester();
  }, [id]);

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "upcoming":
        return "info";
      default:
        return "dark";
    }
  };

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" role="status" className="me-2">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="fs-5 text-muted">Loading semester details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Error Loading Semester</Alert.Heading>
          <p>
            We could not retrieve the semester details. Please try again later.
          </p>
          {error.message && (
            <small className="d-block mt-2">Details: {error.message}</small>
          )}
        </Alert>
      </Container>
    );
  }

  if (!semester) {
    return (
      <Container className="mt-5">
        <Alert variant="info" className="text-center">
          <Alert.Heading>Semester Not Found</Alert.Heading>
          <p>The semester you are looking for does not exist or has been removed.</p>
        </Alert>
      </Container>
    );
  }

  return (
  <Container className="py-4">
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Header className="bg-primary text-white py-3 px-4 d-flex justify-content-between align-items-center rounded-top-4">
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="light"
              size="sm"
              className="rounded-circle d-flex align-items-center justify-content-center"
              onClick={() => navigate(-1)}
              style={{ width: "36px", height: "36px" }}
            >
              <i className="bx bx-arrow-back text-primary fs-5"></i>
            </Button>
            <Card.Title as="h2" className="mb-0 fs-3 text-white">
              {semester.name}
            </Card.Title>
          </div>
          <Badge bg={getStatusVariant(semester.status)} className="fs-6 px-3 py-2">
            {semester.status}
          </Badge>
        </Card.Header>

        <Card.Body className="p-4">
          <h3 className="mb-4 text-secondary">Basic Information</h3>
          <Row className="g-4 mb-4">
            <Col md={6}>
              <div className="fw-bold text-muted small mb-1">Academic Year</div>
              <div className="fs-5">{semester.academicYear?.name}</div>
            </Col>
            <Col md={6}>
              <div className="fw-bold text-muted small mb-1">Start Date</div>
              <div className="fs-5">
                {new Date(semester.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </Col>
            <Col md={6}>
              <div className="fw-bold text-muted small mb-1">End Date</div>
              <div className="fs-5">
                {new Date(semester.endDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </Col>
            <Col md={12}>
              <div className="fw-bold text-muted small mb-1">Description</div>
              <div className="fs-5">{semester.description || "No description provided."}</div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}