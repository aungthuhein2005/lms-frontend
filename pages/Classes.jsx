import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { Modal } from "react-bootstrap";
import { useState,useEffect } from 'react';
export default function Classes() {
  const [classes, setClasses] = useState([]); 
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eClass, setEClass] = useState({ id: "", name: "", description: "" });
  const [editStatus, setEditStatus] = useState(false);
 

  async function addClass() {
    await axios
      .post("http://localhost:8383/class/create",{name,description})
      .then((response) => setClasses(prev => [...prev,response.data]));
      setName('');
      setDescription('');
  }

  useEffect(() => {
    getClasses(); //data from localhost enters response
  }, []);

  async function getClasses() {
    await axios
      .get("http://localhost:8383/class/all")
      .then((response) => setClasses(response.data));

  }

  useEffect(() => {
    getClasses(); //data from localhost enters response
  }, []);

  function editClass(editedClass) {
    setEditStatus(true);
    setEClass(editedClass);
    console.log(editClass);
  }
  async function updateClass(updatedClass) {
    await axios
      .put(`http://localhost:8383/class/update/${updatedClass.id}`,updatedClass)
      .then((response) => console.log(response.data));
    setEditStatus(false);
    setEClass({id:"", name: "", description: "",schedule:"" });
    getClasses();
  }

  async function deletedClass(id) {
    await axios
    .delete(`http://localhost:8383/class/delete/${id}`)
    .then((response)=>console.log(response.data));
    getClasses();    
  }

  async function detailClass(id) {
    await axios
      .get(`http://localhost:8383/class/view/${id}`)
      .then((response) => setClasses(response.data));

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
        {classes.map((classData) =>(
          editStatus && classData.id == eClass.id ? (
            <tr key={classData.id}>
              <td>{classData.id}</td>
              <td>
              <input type='text' value={eClass.name} onChange={(e)=> setEClass({...eClass,name:e.target.value})} className='form-control'/>
              </td>
              <td>
                <input type='text' value={eClass.description} onChange={(e)=> setEClass({...eClass,description:e.target.value})} className='form-control'/>
              </td>
              <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => updateClass(eClass)}
                  >
                    <i className="bx  bx-save"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deletedClass(classData.id)}
                  >
                    <i className="bx bxs-trash"></i>
                  </button>
                </td>
              </tr>):
              (
              <tr key={classData.id}>
              <td>{classData.id}</td>
              <td>{classData.name}</td>
              <td>{classData.description}</td>
              <td>{classData.schedule}</td>
              <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => editClass(classData)}
                  >
                    <i className="bx bxs-edit-alt"></i>
                  </button>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => deletedClass(classData.id)}
                  >
                    <i className="bx bxs-trash"></i>
                  </button>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => detailClass(classData.id)}
                  >
                   <i className="bx bx-detail"></i>
                  </button>
                </td>
              </tr>
              )
            ))}
          </tbody>
          </Table>
          </div>
  )          
}