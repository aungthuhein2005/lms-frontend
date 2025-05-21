import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { Modal } from "react-bootstrap";
import { useState,useEffect } from 'react';
export default function Classes() {
  const [classes, setClasses] = useState([]); 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function addClass() {
    await axios
      .post("http://localhost:8080/class/create",{name,description})
      .then((response) => setClasses(prev => [...prev,response.data]));
      setName('');
      setDescription('');
  }

  useEffect(() => {
    getClasses(); //data from localhost enters response
  }, []);

  async function getClasses() {
    await axios
      .get("http://localhost:8080/class/all")
      .then((response) => setClasses(response.data));

  }

  useEffect(() => {
    getClasses(); //data from localhost enters response
  }, []);

  async function deletedClass(id) {
    await axios
    .delete(`http://localhost:8080/class/delete/${id}`)
    .then((response)=>console.log(response.data));
    getClasses();    
  }

  return (
      <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Students</h2>
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
                <Button variant="primary" onClick={() => addClass()}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>      </div>
      <h5>Total - </h5>

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
        {classes.map((classes) =>(
            <tr key={classes.id}>
              <td>{classes.id}</td>
              <td>{classes.name}</td>
              <td>{classes.description}</td>
              <td>{classes.schedule}</td>
              <td>
                    <Button className="btn btn-primary me-2" size="sm" onClick={()=> editedClass(classes)}><i className="bx bxs-edit-alt"></i></Button>
                    <Button className="btn btn-success me-2" size="sm"><i className="bx bx-detail"></i></Button>
                    <Button className="btn btn-danger me-2" size="sm" onClick={()=> deletedClass(classes.id)}><i className="bx bxs-trash"></i></Button>
              </td>
        </tr>
        ))}
        
      </tbody>
    </Table>
    </div>
    
  )
}