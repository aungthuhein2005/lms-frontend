import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, Button, Row, Col, Spinner, Badge, Form, InputGroup
} from "react-bootstrap";
import { FaBookOpen, FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const { roleId: teacherId } = useSelector((state) => state.auth.user); // Get teacher ID

  const getTeacherCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/courses/teacher/${teacherId}`);
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch teacher courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      getTeacherCourses();
    }
  }, [teacherId]);

  // Filtered and paginated
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">My Courses</h2>
        
          <Form.Control
            placeholder="🔍 Search by title or subject"
            value={searchTerm}
            className="w-50"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
          />
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading your courses...</p>
        </div>
      ) : (
        <>
          {filteredCourses.length === 0 ? (
            <p className="text-muted text-center">No courses found.</p>
          ) : (
            <>
              <Row xs={1} md={2} lg={3} className="g-4">
                {paginatedCourses.map((course) => (
                  <Col key={course.id}>
                    <Card className="shadow-sm h-100 border-start ">
                      <Card.Body className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Badge bg="info" className="text-uppercase">
                            {course.subject.name}
                          </Badge>
                        </div>
                        <Card.Title className="text-primary fw-bold">
                          {course.title}
                        </Card.Title>
                        <Card.Text className="text-muted small">
                          {course.description || "No description provided."}
                        </Card.Text>
                        <div className="mt-auto text-end">
                          <Link
                            to={`${course.id}/modules`}
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          >
                            View Modules
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
        </>
      )}
    </div>
  );
}
