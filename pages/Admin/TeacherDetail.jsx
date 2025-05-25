import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetTeachersQuery } from '../../features/api/teacherApiSlice';
import { Spinner, Alert, Card, Row, Col, Badge } from 'react-bootstrap';
import DateHelper from '../../helpers/DateHelper';

export default function TeacherDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetTeachersQuery(id);
  const teacher = data && data[0];
  if (isLoading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">Error loading teacher data.</Alert>;
  if (!teacher) return <Alert variant="warning">Teacher not found.</Alert>;

  return (
    <div className="container my-4">
      <h2 className="mb-4"> Teacher Profile</h2>

      <Card className="shadow-lg border-0 rounded-4">
        <Row className="g-0">
          <Col md={4} className="d-flex align-items-center justify-content-center p-3">
            <img
              src={teacher.profilePicture || 'https://via.placeholder.com/200x200'}
              alt={teacher.name}
              className="img-fluid rounded-circle border border-2"
              style={{ width: 180, height: 180, objectFit: 'cover' }}
            />
          </Col>
          <Col md={8}>
            <Card.Body className="p-4">
              <h4>{teacher.name}</h4>
              <p className="text-muted">{teacher.email}</p>

              <Row className="mb-3">
                <Col xs={6}>
                  <strong>Department:</strong> <Badge bg="info">{teacher.department}</Badge>
                </Col>
                <Col xs={6}>
                  <strong>Joined:</strong> {DateHelper.formatYMD(teacher.hireDate)}
                </Col>
              </Row>

              <h5 className="mt-4">Bio</h5>
              <p>{teacher.bio || 'No biography available.'}</p>

              <h5 className="mt-4">Classes</h5>
              {teacher.classes && teacher.classes.length > 0 ? (
                <ul>
                  {teacher.classes.map((cls) => (
                    <li key={cls.id}>
                      {cls.name} ({cls.subject})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No classes assigned.</p>
              )}
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
