import React, { useEffect, useState } from "react";
import { Card, Badge, Row, Col } from "react-bootstrap";
import { FaUserTie, FaCalendarAlt, FaUsers, FaChalkboard } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useGetClassByIdQuery } from "../features/api/classApiSlice";
import ClassScheduleTable from "./ClassScheduleTable";
import axios from "axios";
import StudentList from "./StudentList";
import { useSelector } from "react-redux";

export default function ClassDetail() {
  let {role} = useSelector((state) => state.auth.user);
  
  const { id } = useParams();
  const { data, isLoading, error } = useGetClassByIdQuery(id);
  const [students, setStudents] = useState([]);
  
  useEffect(() => {
    const getStudents = async () => {
      try {
        const response = await axios(`http://localhost:8080/classes/${id}/students`);
        setStudents(response.data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    };

    if (id) getStudents();
  }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading class data.</p>;
  if (!data) return <p>No class data provided.</p>;

  const {
    name,
    description,
    schedules,
    semester,
    course,
    teacher,
  } = data;

  return (
    <div className="container py-5">
      <Card className="shadow-sm rounded-4">
        <Card.Body>
          <h3 className="fw-bold mb-3 d-flex align-items-center">
            <FaChalkboard className="me-2" />
            {name}
            <Badge bg="secondary" className="ms-3">{`ID: ${data.id}`}</Badge>
          </h3>

          <Row className="mb-3">
            <Col md={6}>
              <p><strong>Description:</strong> {description || "No description"}</p>
              <p>
                <strong>Course:</strong>{" "}
                {course ? (
                  <Link to={`/${role.toLowerCase()}/courses/${course.id}/modules`}>{course.title}</Link>
                ) : "Not scheduled yet"}
              </p>
              <p><strong>Semester:</strong> {semester?.name || "Not assigned"}</p>
            </Col>
            <Col md={6}>
              <p>
                <FaUserTie className="me-2" />
                <strong>Teacher:</strong> {teacher?.user?.name || "Not assigned"}
              </p>
              {teacher?.hire_date && (
                <p>
                  <FaCalendarAlt className="me-2" />
                  <strong>Hired on:</strong> {teacher.hire_date}
                </p>
              )}
              <p>
                <FaUsers className="me-2" />
                <strong>Enrolled Students:</strong> {students.length}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <ClassScheduleTable schedules={schedules} />
      {role !== 'STUDENT' && <StudentList students={students} courseId={data.course?.id} />}
    </div>
  );
}
