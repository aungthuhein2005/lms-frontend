import React, { useState } from "react";
import {
  Card, Button, Row, Col, Spinner, Badge, Container, Form,
} from "react-bootstrap";
import {
  FaCalendarAlt, FaInfoCircle,
} from "react-icons/fa";
import { useGetClassByTeacherIdQuery } from "../../features/api/classApiSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useGetClassSummaryQuery, useGetCourseProgressQuery } from "../../features/api/teacherDashboardApiSlice";

export default function Classes() {
  const { roleId } = useSelector((state) => state.auth.user);
  const { data: classes = [], isLoading } = useGetClassByTeacherIdQuery(roleId);
  const {data: progress} = useGetCourseProgressQuery(roleId);

  
  console.log(progress);
  
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  // Get unique academic years for filter dropdown
  const academicYears = [
    ...new Set(classes.map(c => c.semester?.academicYear?.name).filter(Boolean))
  ];

  const filtered = classes
    .filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(c =>
      selectedYear ? c.semester?.academicYear?.name === selectedYear : true
    );

  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">My Classes</h2>
      </div>

      {/* Filters */}
      <Row className="g-2 mb-4">
        <Col md={6}>
          <Form.Control
            placeholder="🔍 Search by class or description"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setCurrentPage(0);
            }}
          >
            <option value="">All Academic Years</option>
            {academicYears.map((year, i) => (
              <option key={i} value={year}>{year}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setSearchTerm("");
              setSelectedYear("");
              setCurrentPage(0);
            }}
          >
            Reset
          </Button>
        </Col>
      </Row>

      {/* Loading */}
      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading classes...</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted text-center">No classes found.</p>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {paginated.map((clas) => (
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

                    <Card.Text className="text-secondary mb-3 small">
                      <strong>Description:</strong>{" "}
                      {clas.description || "No description provided."}
                    </Card.Text>

                    <Card.Text className="text-muted mb-4 d-flex align-items-center">
                      <FaCalendarAlt className="me-2 text-primary" />
                      <small className="fw-semibold">Academic Year:</small>{" "}
                      <span className="ms-1">{clas.semester?.academicYear?.name || "N/A"}</span>
                    </Card.Text>

                    <div className="mt-auto text-end pt-3 border-top">
                      <Link
                        to={`${clas.id}`}
                        className="btn btn-sm btn-primary rounded-pill px-4 py-2 fw-bold"
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

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <ReactPaginate
                pageCount={pageCount}
                onPageChange={handlePageChange}
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                activeClassName="active"
                previousLabel="«"
                nextLabel="»"
                previousClassName="page-item"
                nextClassName="page-item"
                previousLinkClassName="page-link"
                nextLinkClassName="page-link"
                forcePage={currentPage}
              />
            </div>
          )}
        </>
      )}
    </Container>
  );
}
