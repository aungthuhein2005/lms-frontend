import { useState } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ErrorMessage from '../../components/ErrorMessage';
import { useUpdateTeacherMutation,useGetTeacherByIdQuery } from '../../features/api/teacherApiSlice';


const TeacherProfile = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetTeacherByIdQuery(user?.roleId);
  const [updateTeacherMutation] = useUpdateTeacherMutation();
  const [showModal, setShowModal] = useState(false);

  // Default blank or fallback values
  const teacherUser = data?.teacher.user || {};
  console.log(teacherUser);
  
  const teacherProfile = data || {};

  const [formData, setFormData] = useState({
    name: teacherUser.name || '',
    email: teacherUser.email || '',
    phone: teacherUser.phone || '',
    address: teacherUser.address || '',
    gender: teacherUser.gender || '',
    dob: teacherUser.dob || '',
    profile: teacherUser.profile || '',
  });

  if (!isAuthenticated) return <ErrorMessage message="You are not authorized to view this page." />;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <ErrorMessage message="Failed to load teacher data." />;
  if (!data) return <ErrorMessage message="Teacher not found." />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTeacherMutation({ id: user?.roleId, ...formData });
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-primary">Teacher Profile</h2>
      <Card className="shadow-sm rounded-4 p-4">
        <Row className="align-items-center">
          <Col md={3} className="text-center">
            {data.teacher.user.profile ? (
              <img
                src={data.teacher.user.profile}
                alt={data.teacher.user.name}
                className="rounded-circle img-fluid"
                style={{ width: 120, height: 120, objectFit: 'cover' }}
              />
            ) : (
              <p></p>
            )}
            <h5 className="mt-3">{data.teacher.user.name}</h5>
            <Badge bg="info" className="text-uppercase mt-2">{data.teacher.user.role}</Badge>
            <div className="mt-3">
              <Button variant="primary" onClick={() => setShowModal(true)}>Edit Profile</Button>
            </div>
          </Col>

          <Col md={9}>
            <Row>
              <Col sm={6} className="mb-3">
                <strong>Email:</strong>
                <div>{data.teacher.user.email || <span className="text-muted">Not provided</span>}</div>
              </Col>
              <Col sm={6} className="mb-3">
                <strong>Phone:</strong>
                <div>{data.teacher.user.phone || <span className="text-muted">Not provided</span>}</div>
              </Col>
              <Col sm={6} className="mb-3">
                <strong>Address:</strong>
                <div>{data.teacher.user.address || <span className="text-muted">Not provided</span>}</div>
              </Col>
              <Col sm={6} className="mb-3">
                <strong>Gender:</strong>
                <div>{data.teacher.user.gender || <span className="text-muted">Not specified</span>}</div>
              </Col>
              <Col sm={6} className="mb-3">
                <strong>Date of Birth:</strong>
                <div>{data.teacher.user.dob || <span className="text-muted">Not provided</span>}</div>
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
      {/* Full Name */}
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

      {/* Email */}
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

      {/* Phone & DOB */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Label className="fw-semibold">Phone</Form.Label>
          <Form.Control
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+959-123456789"
          />
        </div>
        <div className="col-md-6 mb-3">
          <Form.Label className="fw-semibold">Date of Birth</Form.Label>
          <Form.Control
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Address */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Address</Form.Label>
        <Form.Control
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
        />
      </Form.Group>

      {/* Gender */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Gender</Form.Label>
        <Form.Select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </Form.Select>
      </Form.Group>

      {/* Profile Image */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Profile Image URL</Form.Label>
        <Form.Control
          name="profile"
          value={formData.profile}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </Form.Group>

      {/* Buttons */}
      <div className="d-flex justify-content-end">
        <Button
          variant="outline-secondary"
          onClick={() => setShowModal(false)}
          className="me-2"
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          <i className="bx bx-save me-1"></i> Save Changes
        </Button>
      </div>
    </Form>
  </Modal.Body>
</Modal>

    </div>
  );
};

export default TeacherProfile;
