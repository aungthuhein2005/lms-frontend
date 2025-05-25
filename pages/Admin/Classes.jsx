import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { Modal } from "react-bootstrap";
import { useState,useEffect } from 'react';
import { useAddClassMutation, useDeleteClassMutation, useGetClassesQuery } from '../../features/api/classApiSlice';
export default function Classes() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const {data, isLoading, error} = useGetClassesQuery();
  const [addClass, { isLoading: isAddingClass }] = useAddClassMutation();
  const [deletedClass] = useDeleteClassMutation();

async function handleAddClass() {
    try {
      await addClass({ name, description }).unwrap();  // Call mutation function
      setName('');
      setDescription('');
      handleClose();
      console.log('Class added successfully');
    } catch (err) {
      console.error('Failed to add class:', err);
    }
  }

  const handleDeleteClass = (id) => {
    const result = confirm('Are you sure? You want to delete this class')
    if (result) {
      try {
        deletedClass(id)
        console.log('Class deleted successfully');
      } catch (error) {
        alert('Failed to delete class.')
      }
    }
  }


  return (
      <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Classes</h2>
<button className="btn btn-primary" onClick={() => handleShow()}>
              Add Class
            </button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>AddClass</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form action="">
                  <div className="mt-3">
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Class Name"
                    />
                  </div>
                  <div className="mt-3">
                    <input
                      type="email"
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter Description"
                    />
                  </div>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleAddClass}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>      </div>
      <h5>Total - {data?.length}</h5>

    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Class Code</th>
          <th>Class Name</th>
          <th>Description</th>
          <th>Schedule</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((cls) =>(
            <tr key={cls.id}>
              <td>{cls.id}</td>
              <td>{cls.name}</td>
              <td>{cls.description}</td>
              <td>{cls.schedule}</td>
              <td>
                    <Button className="btn btn-primary me-2" size="sm" onClick={()=> editedClass(cls)}><i className="bx bxs-edit-alt"></i></Button>
                    <Button className="btn btn-success me-2" size="sm"><i className="bx bx-detail"></i></Button>
                    <Button className="btn btn-danger me-2" size="sm" onClick={()=> handleDeleteClass(cls.id)}><i className="bx bxs-trash"></i></Button>
              </td>
        </tr>
        ))}
        
      </tbody>
    </Table>
    </div>
    
  )
}