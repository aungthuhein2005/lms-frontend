import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useGetUsersQuery } from '../features/api/userApiSlice';
import { useCreateTeacherMutation } from '../features/api/teacherApiSlice';
import { showAlert } from '../features/ui/alertSlice';

export default function AddTeacherModal({ show, handleClose }) {
  const dispatch = useDispatch();
  const { data: users = [] } = useGetUsersQuery();
  const [createTeacher] = useCreateTeacherMutation();

  const [formData, setFormData] = useState({
    userId: '',
    hireDate: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTeacher(formData).unwrap();
      dispatch(showAlert({
        show: true,
        message: 'Teacher added successfully!',
        type: 'success',
        title: 'Success'
      }));
      handleClose();
    } catch (err) {
      console.error('Error creating teacher:', err);
      dispatch(showAlert({
        show: true,
        message: 'Failed to add teacher',
        type: 'danger',
        title: 'Error'
      }));
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Teacher</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3" controlId="formUser">
            <Form.Label>Select User</Form.Label>
            <Form.Select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select User --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formHireDate">
            <Form.Label>Hire Date</Form.Label>
            <Form.Control
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary">Add Teacher</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
