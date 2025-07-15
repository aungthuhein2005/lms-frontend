import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
  useGetStudentByIdQuery,
  useUpdateStudentMutation
} from '../../features/api/studentApiSlice';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

  // ✅ Hooks MUST be declared at the top level
  const { data: student, isLoading, error } = useGetStudentByIdQuery(user?.roleId);
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    dob: '',
    profile: '',
  });

  // ✅ Load student data into form state AFTER it's available
  useEffect(() => {
    if (student && student.user) {
      setFormData({
        name: student.user.name || '',
        email: student.user.email || '',
        phone: student.user.phone || '',
        address: student.user.address || '',
        gender: student.user.gender || '',
        dob: student.user.dob || '',
        profile: student.user.profile || '',
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudent({ id: user?.roleId, ...formData }).unwrap();
      setShowModal(false);
    } catch (err) {
      console.error('Profile update failed', err);
    }
  };

  // ✅ Only return JSX after hook execution
  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Student Profile</h2>
      <Card className="shadow-sm rounded-4 p-4">
        <Row className="align-items-center">
          <Col md={3} className="text-center">
            {student.user.profile ? (
              <img
                src={student.user.profile}
                alt={student.user.name}
                className="rounded-circle img-fluid"
                style={{ width: 120, height: 120, objectFit: 'cover' }}
              />
            ) : (
              <div className="text-muted">No Image</div>
            )}
            <h5 className="mt-3">{student.user.name}</h5>
            <Badge bg="info" className="text-uppercase mt-2">
              {student.user.role}
            </Badge>
            <div className="mt-3">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Edit Profile
              </Button>
            </div>
          </Col>

          <Col md={9}>
            <Row>
              <Col sm={6} className="mb-3">
                <strong>Email:</strong>
                <div>{student.user.email || <span className="text-muted">Not provided</span>}</div>
              </Col>
              <Col sm={6} className="mb-3">
                <strong>Phone:</strong>
                <div>{student.user.phone || <span className="text-muted">Not provided</span>}</div>
              </Col>
              <Col sm={6} className="mb-3">
                <strong>Address:</strong>
                <div>{student.user.address || <span className="text-muted">Not provided</span>}</div>
              </Col>
              <Col sm={6} className="mb-3">
                <strong>Gender:</strong>
                <div>{student.user.gender || <span className="text-muted">Not specified</span>}</div>
              </Col>
              <Col sm={6} className="mb-3">
                <strong>Date of Birth:</strong>
                <div>{student.user.dob || <span className="text-muted">Not provided</span>}</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title className="fw-bold">✏️ Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Full Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Label className="fw-semibold">Phone</Form.Label>
                <Form.Control
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+959-123456789"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label className="fw-semibold">Date of Birth</Form.Label>
                <Form.Control
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Address</Form.Label>
              <Form.Control
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Gender</Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Profile Image URL</Form.Label>
              <Form.Control
                name="profile"
                value={formData.profile}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="outline-secondary" onClick={() => setShowModal(false)} className="me-2">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : <><i className="bx bx-save me-1"></i> Save Changes</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
