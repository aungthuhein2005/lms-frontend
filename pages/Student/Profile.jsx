import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Form, ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
  useGetStudentByIdQuery,
  useUpdateStudentMutation
} from '../../features/api/studentApiSlice';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

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

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center fw-bold text-primary">Your Student Profile</h2>
      <Card className="shadow-md rounded-5 overflow-hidden border-0">
        <Row className="g-0">
          <Col md={4} className="bg-light p-4 d-flex flex-column align-items-center justify-content-center border-end">
            <div className="position-relative mb-3">
              {student.user.profile ? (
                <img
                  src={student.user.profile}
                  alt={student.user.name}
                  className="rounded-circle border border-primary border-3"
                  style={{ width: 150, height: 150, objectFit: 'cover' }}
                />
              ) : (
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 150, height: 150 }}>
                  <i className="bi bi-person-fill" style={{ fontSize: '4rem' }}></i> {/* Bootstrap Icons */}
                </div>
              )}
              <Badge bg="primary" className="position-absolute bottom-0 end-0 translate-middle badge-lg rounded-pill px-3 py-2">
                {student.user.role || 'Student'}
              </Badge>
            </div>
            <h4 className="mt-3 mb-1 text-center">{student.user.name}</h4>
            <p className="text-muted text-center">{student.user.email}</p>
            <Button variant="outline-primary" onClick={() => setShowModal(true)} className="mt-3 px-4 py-2 rounded-pill">
              <i className="bi bi-pencil-square me-2"></i> Edit Profile
            </Button>
          </Col>

          <Col md={8} className="p-5">
            <h3 className="mb-4 text-primary">Personal Information</h3>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between align-items-start px-0 py-2">
                <div className="fw-semibold text-muted w-25">Phone</div>
                <div className="text-end flex-grow-1">{student.user.phone || <span className="text-muted fst-italic">Not provided</span>}</div>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-start px-0 py-2">
                <div className="fw-semibold text-muted w-25">Address</div>
                <div className="text-end flex-grow-1">{student.user.address || <span className="text-muted fst-italic">Not provided</span>}</div>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-start px-0 py-2">
                <div className="fw-semibold text-muted w-25">Gender</div>
                <div className="text-end flex-grow-1">{student.user.gender || <span className="text-muted fst-italic">Not specified</span>}</div>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-start px-0 py-2">
                <div className="fw-semibold text-muted w-25">Date of Birth</div>
                <div className="text-end flex-grow-1">{student.user.dob || <span className="text-muted fst-italic">Not provided</span>}</div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Card>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold text-primary">✏️ Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4 pt-0">
          <p className="text-muted mb-4">Update your personal information below.</p>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
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
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Phone</Form.Label>
                  <Form.Control
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+959-123456789"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Date of Birth</Form.Label>
                  <Form.Control
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </Form.Group>
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

            <div className="d-flex justify-content-end pt-3 border-top">
              <Button variant="outline-secondary" onClick={() => setShowModal(false)} className="me-2 px-4 py-2 rounded-pill">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isUpdating} className="px-4 py-2 rounded-pill">
                {isUpdating ? 'Saving...' : <><i className="bi bi-cloud-arrow-up-fill me-2"></i> Save Changes</>}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}