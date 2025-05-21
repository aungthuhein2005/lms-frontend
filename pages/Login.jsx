import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authThunk";
import logo from '@/assets/logo.png';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

   const { user, isAuthenticated, error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'STUDENT') {
        navigate('/student');
      } else if (user.role === 'TEACHER') {
        navigate('/teacher');
      }
    }
  }, [isAuthenticated, user, navigate]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
    .then((resp)=>{
      const user = resp.payload.user;
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'STUDENT') {
        navigate('/student');
      } else if (user.role === 'TEACHER') {
        navigate('/teacher');
      }
    });
  };

  return (
    <Container className="d-flex vh-100 align-items-center justify-content-center bg-light">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <img
                  src={logo} // replace with your logo path
                  alt="App Logo"
                  style={{ width: "60px", height: "60px" }}
                />
                <h3 className="mt-3 fw-bold">LMS</h3>
                <p className="text-muted">Sign in to continue</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <small className="text-muted">Forgot your password?</small><br />
                <small className="text-muted">Don't have an account? <Link to={'/register'}>Register here</Link></small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
