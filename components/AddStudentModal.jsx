import React, { useState } from 'react'
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function AddStudentModal() {

    const users = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Alice Johnson' },
        { id: 4, name: 'Bob Brown' }
    ]

      const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
        <Form>
     

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Users</Form.Label>
        <Form.Select aria-label="Default select example">
      <option>Select user</option>
      {users.map(user=>(
        <option value={user.id} >{user.name}</option>
      ))}
    </Form.Select>
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
