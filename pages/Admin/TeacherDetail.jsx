import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetTeacherByIdQuery, useGetTeachersQuery } from '../../features/api/teacherApiSlice';
import { Spinner, Alert, Card, Row, Col, Badge } from 'react-bootstrap';
import DateHelper from '../../helpers/DateHelper';

export default function TeacherDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetTeacherByIdQuery(id);
  console.log(data)
  // const teacher = data.teacher;
  if (isLoading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">Error loading teacher data.</Alert>;
  if (!data.teacher) return <Alert variant="warning">Teacher not found.</Alert>;

  return (
    <div className="container my-4">
      <h2 className="mb-4"> Teacher Profile</h2>

      <Card className="shadow-lg border-0 rounded-4">
        <Row className="g-0">
          <Col md={4} className="d-flex align-items-center justify-content-center p-3">
            <img
              src={data.teacher.profilePicture || 'https://via.placeholder.com/200x200'}
              alt={data.teacher.user.name}
              className="img-fluid rounded-circle border border-2"
              style={{ width: 180, height: 180, objectFit: 'cover' }}
            />
          </Col>
          <Col md={8}>
            <Card.Body className="p-4">
              <h4>{data.teacher.user.name}</h4>
              <p className="text-muted">{data.teacher.user.email}</p>

              <Row className="mb-3">
                <Col xs={6}>
                  <strong>Department:</strong> <Badge bg="info">{data.teacher.department}</Badge>
                </Col>
                <Col xs={6}>
                  <strong>Hired At:</strong> {DateHelper.formatYMD(data.teacher.hire_date)}
                </Col>
              </Row>

              <h5 className="mt-4">Bio</h5>
              <p>{data.teacher.bio || 'No biography available.'}</p>

              <h5 className="mt-4">Classes</h5>
              {data.classes && data.classes.length > 0 ? (
                data.classes.map((clas) => (
                  <Badge key={clas.id} bg="secondary" className="me-2 mb-2">
                    <Link to={`/admin/classes/${clas.id}`} className="text-white text-decoration-none">
                      {clas.name}
                    </Link>
                  </Badge>
                ))
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
