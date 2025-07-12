import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";
import { FaBookOpen, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          <FaBookOpen className="me-2" /> My Courses
        </h3>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading your courses...</p>
        </div>
      ) : (
        <>
          {courses.length === 0 ? (
            <p className="text-muted text-center">No courses assigned to you.</p>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {courses.map((course) => (
                <Col key={course.id}>
                  <Card className="shadow-sm h-100">
                    <Card.Body>
                      <Card.Title className="fw-semibold">{course.title}</Card.Title>
                      <Card.Text className="text-muted">
                        {course.description || "No description provided."}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-end">
                      <Link to={`${course.id}/modules`} className="btn btn-sm btn-primary rounded-pill px-4 py-2">
                        View Modules
                      </Link>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </div>
  );
}
