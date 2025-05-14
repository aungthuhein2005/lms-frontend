import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const Settings = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    console.log({ email, phone, password, emailNotifications });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg rounded-4 border-0">
            <Card.Body className="p-5">
              <h3 className="mb-4 fw-bold text-center">Settings</h3>

              {/* Email */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  {/* <FaEnvelope className="me-2 text-primary" /> */}
                  <h6 className="text-uppercase m-0">Change Email</h6>
                </div>
                <Form.Floating>
                  <Form.Control
                    id="floatingEmail"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="floatingEmail">Email address</label>
                </Form.Floating>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  {/* <FaPhone className="me-2 text-success" /> */}
                  <h6 className="text-uppercase m-0">Phone Number</h6>
                </div>
                <Form.Floating>
                  <Form.Control
                    id="floatingPhone"
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <label htmlFor="floatingPhone">Phone number</label>
                </Form.Floating>
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                  {/* <FaLock className="me-2 text-warning" /> */}
                  <h6 className="text-uppercase m-0">Change Password</h6>
                </div>
                <Form.Floating>
                  <Form.Control
                    id="floatingPassword"
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="floatingPassword">New password</label>
                </Form.Floating>
              </div>

              {/* Email Notifications Switch */}
              <div className="mb-4 border-top pt-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    {/* <FaBell className="me-2 text-danger" /> */}
                    <h6 className="text-uppercase m-0">Email Notifications</h6>
                  </div>
                  <Form.Check
                    type="switch"
                    id="emailNotifySwitch"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                    label=""
                  />
                </div>
                <small className="text-muted ms-4">
                  Enable or disable system email alerts
                </small>
              </div>

              <Button variant="dark" className="w-100 mt-3 rounded-pill py-2" onClick={handleSave}>
                Save Settings
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
