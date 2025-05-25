import React, { useState } from 'react'
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useGetUsersQuery } from '../features/api/userApiSlice';
import { useAddStudentMutation } from '../features/api/studentApiSlice';
import { useDispatch } from 'react-redux';
import { showAlert } from '../features/ui/alertSlice';

export default function AddStudentModal() {

const dispatch = useDispatch();

    const {data: users = [], isLoading, error} = useGetUsersQuery();
    const [studentCreate] = useAddStudentMutation();
    const [formData, seteFormData] = useState({userId: '',enroll_date: ''});

      const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    studentCreate(formData).unwrap()
      .then((res) => {
        dispatch(
          showAlert({
            show: true,
            title: "Success",
            type: "success",
            message: res.message,
          })
        )
      })
      .catch((error) => {
        dispatch(
          showAlert({
            show: true,
            title: "Error",
            type: "danger",
            message:"Failed to add student.",
          })
        );
      });
    handleClose();
  }

  return (

    <>
        <Button variant="primary" className='d-flex align-items-center gap-2' onClick={handleShow}>
        <i class='bx bx-plus-circle' style={{fontSize:24}}></i>Add Student 
      </Button>



<Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onHide={handleClose} />
      <Modal.Body>
        <h4>Add Student</h4>
        <Form onSubmit={handleSubmit}>
     

      <Form.Group className="mb-3" controlId="formUserSelect">
        <Form.Label>Users</Form.Label>
        <Form.Select aria-label="user select" value={formData.userId}  onChange={(e)=>seteFormData({...formData, userId: Number(e.target.value)})} >
      <option>Select user</option>
      {users.map(user=>(
        <option value={user.id} key={user.id} >{user.name}</option>
      ))}
    </Form.Select>

      </Form.Group>

      <Form.Group className="mb-3" controlId="formEnrollDate">
        <Form.Label>Enroll Date</Form.Label>
        <Form.Control
          type="date"
          placeholder="Enter enroll date"
          value={formData.enroll_date}
          onChange={(e) => seteFormData({...formData, enroll_date: e.target.value})}
        />
      </Form.Group>
      
      <Button variant="primary" type="submit">
        Add
      </Button>
    </Form>
      </Modal.Body>
    </Modal>
    </>
  )
}
