import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  ListGroup,
  Button,
} from "react-bootstrap"; // Import Button
import { useGetAcademicYearByIdQuery } from "../../features/api/academicYearApiSlice";
import NewSemesterModal from "../../components/NewSemesterModal";
import { useDeleteSemesterMutation } from "../../features/api/semesterServiceApiSlice";
import { useDispatch } from "react-redux";
import { showAlert } from "../../features/ui/alertSlice";
import { confirm } from "../../helpers/confirm";

export default function AcademicYearDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    data: academicYear,
    isLoading,
    error,
    refetch
  } = useGetAcademicYearByIdQuery(id);
  const [deleteSemester] = useDeleteSemesterMutation(); // Assuming you have a delete mutation

  //academic_year_id, semestername, startdate,enddate

  const [showModal, setShowModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleEditSemester = (semesterId) => {
    const semester = academicYear.semesters.find((s) => s.id === semesterId);
    console.log(semester);
    
    if (semester) {
      setSelectedSemester(semester);
      setShowModal(true);
    }
  };

  const handleDeleteSemester = async(semesterId, semesterName) => {
    const result = await confirm('Are you sure you want to delete this semester?');
    if (result) {
      console.log(`Delete semester with ID: ${semesterId}`);
      deleteSemester(semesterId)
        .unwrap()
        .then(() => {
          refetch();
          dispatch(showAlert({
            message: `Semester "${semesterName}" deleted successfully!`,
            type: "success",
            title: "Success",
          }));
        }).catch((error) => {
          console.error("Failed to delete semester:", error);
          dispatch(showAlert({
            message: `Failed to delete semester "${semesterName}". Please try again.`,
            type: "danger",
            title: "Error",
          }));
        });
    }
  };

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
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
            {error.message && (
              <small className="d-block mt-2">Details: {error.message}</small>
            )}
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
      <NewSemesterModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setSelectedSemester(null); // Clear after closing
        }}
        id={id}
        semester={selectedSemester}
        refetch={refetch} // Pass refetch to update the semester list
      />

      <h1 className="text-center mb-4 text-primary fw-bold">
        Academic Year Details
      </h1>

      <Card className="shadow-sm mb-5 border-0">
        <Card.Header className="bg-primary text-white">
          <Card.Title as="h2" className="mb-0 fs-3">
            {academicYear.name}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Text className="mb-2 fs-5">
            <strong>Start Date:</strong>{" "}
            {new Date(academicYear.startDate).toLocaleDateString()}
          </Card.Text>
          <Card.Text className="fs-5">
            <strong>End Date:</strong>{" "}
            {new Date(academicYear.endDate).toLocaleDateString()}
          </Card.Text>
        </Card.Body>
      </Card>

      <div className="mb-4 border-bottom pb-2 d-flex align-items-center justify-content-between">
        <h2 className=" text-secondary">Semesters</h2>
        <button
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={() => {
            setSelectedSemester(null);
            handleShow();
          }}
        >
          <i className="bx bx-calendar-plus"></i>
          <span>New Semester</span>
        </button>
      </div>
      {academicYear.semesters && academicYear.semesters.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {academicYear.semesters.map((semester) => (
            <Col key={semester.id}>
              <Card className="h-100 shadow-sm border-success">
                <Card.Body className="d-flex flex-column">
                  {" "}
                  {/* Use flex-column for content + buttons */}
                  <Card.Title as="h3" className="text-success mb-3 fs-4">
                    {semester.name}
                  </Card.Title>
                  <ListGroup variant="flush" className="flex-grow-1">
                    {" "}
                    {/* flex-grow-1 to push buttons to bottom */}
                    <ListGroup.Item>
                      <strong>Start:</strong>{" "}
                      {new Date(semester.startDate).toLocaleDateString()}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>End:</strong>{" "}
                      {new Date(semester.endDate).toLocaleDateString()}
                    </ListGroup.Item>
                  </ListGroup>
                  <div className="d-flex justify-content-end mt-3">
                    {" "}
                    <Link to={`/admin/semesters/${semester.id}`}>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="me-2"
                    >
                      Detail
                    </Button></Link>
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
                      onClick={() =>
                        handleDeleteSemester(semester.id, semester.name)
                      }
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
          <p className="mb-0">
            This academic year does not have any semesters associated with it
            yet.
          </p>
        </Alert>
      )}
    </Container>
  );
}
