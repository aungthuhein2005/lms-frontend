import React from "react";
import axios from "axios";
import {
  Card,
  Button,
  Row,
  Col,
  Spinner,
  Badge,
  Container,
} from "react-bootstrap";
import {
  FaChalkboard,
  FaPlus,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { useGetClassByTeacherIdQuery } from "../../features/api/classApiSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Classes() {
  const { id } = useSelector((state) => state.auth.user);
  const {
    data: classes,
    isLoading,
    isError,
  } = useGetClassByTeacherIdQuery(2); // Use dynamic user ID

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold d-flex align-items-center gap-2">
          <FaChalkboard /> My Classes
        </h3>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading classes...</p>
        </div>
      ) : (
        <>
          {classes?.length === 0 ? (
            <p className="text-muted text-center">No classes assigned yet.</p>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {classes?.map((clas) => (
                <Col key={clas.id}>
                  <Card className="h-100 border rounded-4">
      <Card.Body className="d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <Card.Title className="fw-bold fs-4 text-primary mb-0">
            {clas.name}
          </Card.Title>
          <Badge bg="info" className="align-self-start py-2 px-3 rounded-pill text-uppercase">
            {clas.semester?.name}
          </Badge>
        </div>

        <Card.Text className="text-secondary mb-3 small"> {/* Slightly smaller, more muted text */}
          <strong>Description:</strong>{" "}
          {clas.description || "No description provided."}
        </Card.Text>

        <Card.Text className="text-muted mb-4 d-flex align-items-center"> {/* Aligned icon and text */}
          <FaCalendarAlt className="me-2 text-primary" /> {/* Primary color icon */}
          <small className="fw-semibold">Academic Year:</small>{" "} {/* Slightly bolder, smaller text */}
          <span className="ms-1">{clas.semester?.academicYear?.name || "N/A"}</span>
        </Card.Text>

        <div className="mt-auto text-end pt-3 border-top"> {/* Top border for separation */}
          <Link
            to={`${clas.id}`}
            className="btn btn-sm btn-primary rounded-pill px-4 py-2 fw-bold" // Solid primary button, bolder
          >
            <FaInfoCircle className="me-2" />
            View Details
          </Link>
        </div>
      </Card.Body>
    </Card>

                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
}
