import React from "react";
import { Card, Row, Col, ListGroup, Image, Tabs, Tab } from "react-bootstrap";
import { useParams } from "react-router-dom";
import admin_image from '@/assets/teacher-profile.jpg'; // Consider renaming to a more general placeholder if it's for students
import { useGetAssignedClassesQuery, useGetStudentByIdQuery } from "../../features/api/studentApiSlice";
import StudentEnrollClasses from "../../components/StudentEnrollClasses";

const StudentDetail = () => {
  const {id} = useParams();
  
  const { data: student, isLoading, error } = useGetStudentByIdQuery(id);
  const { data: classes, isLoading: isClassesLoading, error: classesError } = useGetAssignedClassesQuery(id);

  console.log("Student Detail Data:", student);

  if(isLoading || isClassesLoading) return <p>Loading...</p>
  if(error) return <p>Error loading student data: {error.message}</p>
  if(classesError) return <p>Error loading classes: {classesError.message}</p>

  return (
    <>
      <Card className="my-4 shadow-sm">
        <Card.Body>
          <Row className="mb-4">
            <Col md={3} className="text-center">
              <Image
                src={admin_image || "https://via.placeholder.com/150"}
                roundedCircle
                fluid
                style={{ width: '150px', height: '150px', objectFit: 'cover', border: '3px solid #007bff' }}
              />
            </Col>
            <Col md={9}>
              <h2 className="mb-3 text-primary">{student.name}</h2>
              <p className="text-muted">{student.role}</p> {/* Display role prominently */}
            </Col>
          </Row>

          <Tabs defaultActiveKey="details" id="student-detail-tabs" className="mb-3">
            <Tab eventKey="details" title="Student Details">
              <ListGroup variant="flush">
                <ListGroup.Item><strong>ID:</strong> {student.id}</ListGroup.Item>
                <ListGroup.Item><strong>Email:</strong> {student.user.email}</ListGroup.Item>
                <ListGroup.Item><strong>Phone:</strong> {student.user.phone}</ListGroup.Item>
                <ListGroup.Item><strong>Address:</strong> {student.user.address}</ListGroup.Item>
                <ListGroup.Item><strong>Date of Birth:</strong> {student.user.dob}</ListGroup.Item>
              </ListGroup>
            </Tab>
            <Tab eventKey="classes" title="Assigned Classes">
              <StudentEnrollClasses data={classes} />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </>
  );
};

export default StudentDetail;