import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col, Spinner, Alert, ListGroup, Button } from 'react-bootstrap'; // Import Button
import { useGetAcademicYearByIdQuery } from '../../features/api/academicYearApiSlice';

export default function AcademicYearDetail() {
  const { id } = useParams();
  const { data: academicYear, isLoading, error } = useGetAcademicYearByIdQuery(id);

  // Placeholder functions for handling edit and delete.
  // In a real app, these would trigger API calls or navigation.
  const handleEditSemester = (semesterId) => {
    console.log(`Edit semester with ID: ${semesterId}`);
    // Example: navigate(`/semesters/edit/${semesterId}`);
    alert(`Editing Semester ID: ${semesterId}`);
  };

  const handleDeleteSemester = (semesterId, semesterName) => {
    if (window.confirm(`Are you sure you want to delete the semester "${semesterName}"?`)) {
      console.log(`Delete semester with ID: ${semesterId}`);
      // Example: dispatch(deleteSemesterApi(semesterId));
      alert(`Deleting Semester ID: ${semesterId}`);
    }
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" role="status" className="me-2">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="fs-5 text-muted">Loading academic year details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            Error loading academic year. Please try again later.
            {error.message && <small className="d-block mt-2">Details: {error.message}</small>}
          </p>
        </Alert>
      </Container>
    );
  }

  if (!academicYear) {
    return (
      <Container className="mt-5">
        <Alert variant="info" className="text-center">
          <Alert.Heading>No Data Found</Alert.Heading>
          <p>The academic year you are looking for could not be found.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="text-center mb-4 text-primary fw-bold">Academic Year Details</h1>

      <Card className="shadow-sm mb-5 border-0">
        <Card.Header className="bg-primary text-white">
          <Card.Title as="h2" className="mb-0 fs-3">{academicYear.name}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Text className="mb-2 fs-5">
            <strong>Start Date:</strong> {new Date(academicYear.startDate).toLocaleDateString()}
          </Card.Text>
          <Card.Text className="fs-5">
            <strong>End Date:</strong> {new Date(academicYear.endDate).toLocaleDateString()}
          </Card.Text>
        </Card.Body>
      </Card>

      <h2 className="mb-4 text-secondary border-bottom pb-2">Semesters</h2>
      {academicYear.semesters && academicYear.semesters.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {academicYear.semesters.map((semester) => (
            <Col key={semester.id}>
              <Card className="h-100 shadow-sm border-success">
                <Card.Body className="d-flex flex-column"> {/* Use flex-column for content + buttons */}
                  <Card.Title as="h3" className="text-success mb-3 fs-4">{semester.name}</Card.Title>
                  <ListGroup variant="flush" className="flex-grow-1"> {/* flex-grow-1 to push buttons to bottom */}
                    <ListGroup.Item>
                      <strong>Start:</strong> {new Date(semester.startDate).toLocaleDateString()}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>End:</strong> {new Date(semester.endDate).toLocaleDateString()}
                    </ListGroup.Item>
                  </ListGroup>
                  <div className="d-flex justify-content-end mt-3"> {/* Buttons container */}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditSemester(semester.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteSemester(semester.id, semester.name)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="warning" className="text-center mt-4">
          <Alert.Heading>No Semesters Found</Alert.Heading>
          <p className="mb-0">This academic year does not have any semesters associated with it yet.</p>
        </Alert>
      )}
    </Container>
  );
}