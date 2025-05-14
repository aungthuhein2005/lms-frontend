import React, { useEffect } from "react";
import { Card, Row, Col, ListGroup, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
// import student_profile from "@/assets/images/student.avif";
import admin_image from '@/assets/teacher-profile.jpg';
import { useGetStudentByIdQuery } from "../../features/api/apiSlice";

const StudentDetail = () => {
  
  const {id} = useParams();
  
  const { data: student, isLoading, error } = useGetStudentByIdQuery(id);

  if(isLoading) return <p>Loading</p>
  if(error) return <p>{error.message}</p>
  

  return (
    <Card className="mt-4">
      <Card.Header as="h5" className="">
        Student Detail
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={4}>
            <Image
              src={admin_image || "https://via.placeholder.com/150"}
              roundedCircle
              fluid
            />
          </Col>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>ID:</strong> {student.id}</ListGroup.Item>
              <ListGroup.Item><strong>Name:</strong> {student.name}</ListGroup.Item>
              <ListGroup.Item><strong>Email:</strong> {student.email}</ListGroup.Item>
              <ListGroup.Item><strong>Phone:</strong> {student.phone}</ListGroup.Item>
              <ListGroup.Item><strong>Address:</strong> {student.address}</ListGroup.Item>
              <ListGroup.Item><strong>School ID:</strong> {student.school_id}</ListGroup.Item>
              <ListGroup.Item><strong>Role:</strong> {student.role}</ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default StudentDetail;
