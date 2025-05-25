import React from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { showAlert } from "../../features/ui/alertSlice";
import { useAddUserMutation } from "../../features/api/userApiSlice";

export default function UserCreate() {
  const dispatch = useDispatch();
  const [createUser] = useAddUserMutation();

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User created :", formData);
    createUser(formData)
      .unwrap()
      .then((response) => {
         dispatch(
      showAlert({
        show: true,
        title: "Success",
        type: "success",
        message: "User Created Successfully",
      })
    );
    setFormData({
      name: "",
      email: "",
      password: "",
    });
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        dispatch(
          showAlert({
            show: true,
            title: "Error",
            type: "danger",
            message: "Failed to create user",
          })
        );
      });
   
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <div className="container mt-5">
        <h1 className="mb-4">Cretae User</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              onChange={handleChange}
              name="name"
              placeholder="Enter user name"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              placeholder="Enter user email"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={formData.password}
              onChange={handleChange}
              name="password"
              placeholder="Enter user password"
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create User
          </Button>
        </Form>
      </div>
    </div>
  );
}
