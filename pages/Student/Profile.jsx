import React from 'react';
import { Card, Row, Col, Button, ListGroup, Image, Table } from 'react-bootstrap';
import admin from '@/assets/teacher-profile.jpg';
import { useSelector } from 'react-redux';
import { useGetAssignedClassesQuery } from '../../features/api/studentApiSlice';
import StudentEnrollClasses from '../../components/StudentEnrollClasses';

export default function Profile() {

  const {user} = useSelector((state)=>state.auth);
  console.log(user)
  const { data: classes,isLoading: isClassesLoading,error: classesError } = useGetAssignedClassesQuery(3);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Student Profile</h3>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={4} className="text-center">
              <Image src={user?.photoUrl} roundedCircle width={150} height={150} className='object-fit-cover border' />
              <h5 className="mt-3">{user.name}</h5>
              <p className="text-muted">Roll No: {user.rollNumber}</p>
              <Button variant="outline-primary" size="sm">Edit Profile</Button>
            </Col>

            <Col md={8}>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item><strong>Email:</strong> {user.email}</ListGroup.Item>
                    <ListGroup.Item><strong>Phone:</strong> {user.phone}</ListGroup.Item>
                    <ListGroup.Item><strong>Gender:</strong> {user.gender}</ListGroup.Item>
                    <ListGroup.Item><strong>DOB:</strong> {user.dob}</ListGroup.Item>
                    <ListGroup.Item><strong>Address:</strong> {user.address}</ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    {/* <ListGroup.Item><strong>Enrollment Year:</strong> {student?.enrollmentYear}</ListGroup.Item>
                    <ListGroup.Item><strong>Roll No:</strong> {student?.rollNumber}</ListGroup.Item>
                    <ListGroup.Item><strong>Guardian Name:</strong> {student?.guardian.name}</ListGroup.Item>
                    <ListGroup.Item><strong>Guardian Contact:</strong> {student?.guardian.phone}</ListGroup.Item> */}
                  </ListGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Classes Section */}
      {/* <StudentEnrollClasses data={classes} /> */}
    </div>
  );
}
