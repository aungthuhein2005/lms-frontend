import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import logo from "@/assets/logo.png"; // Adjust as needed

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "MALE",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Replace with your actual registration logic
    console.log("Submitted", form);
    setSuccess("User registered successfully!");
    setError("");
  };

  return (
    <Container className="d-flex align-items-center justify-content-center bg-light p-3">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow border-0 ">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <img src={logo} alt="Logo" style={{ width: "60px", height: "60px" }} />
                <h3 className="mt-3 fw-bold">Register</h3>
                <p className="text-muted">Create your account</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Male"
                      type="radio"
                      name="gender"
                      value="MALE"
                      checked={form.gender === "MALE"}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      label="Female"
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={form.gender === "FEMALE"}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button type="submit" variant="primary">
                    Register
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <small className="text-muted">Already have an account? Login</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
