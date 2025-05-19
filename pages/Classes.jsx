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

  async function deletedClass(id) {
    await axios
    .delete(`http://localhost:8383/class/${id}`)
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
                    <Button className="btn btn-primary me-2" size="sm" onClick={()=> editedClass(classes)}><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAZdJREFUSEu11TnPDWEYxvHf2xAlEQpiS+xrKSGWaCQK38BXUGs0GlrfQa0TFWLtJYpX7EFCFAprg3PJfWQyzjJn3vc8zWRmnvlf93LdzyyY81qYM99yCKzAGazCdXxvBt0WOIvL2DUhs184h2tYjVs4VPsXcRifh9+3Bd5iQ0f4moIfxDt8wU48wkn8DKct8Lvg00q3tuD78Qyn8LWeHcB5XO0rsA53sLuCeT64P1ERp1z7cAkX+wisx+2Cv6+otyOl/YYd+IhklutMJQr8IbZVzY+UYyK4p7JJL44NTPBiXJPH9SCNv9uCvy4X3cPehmie/1tdmhz4A2xuQWLRITzQ48j19MCqN7tm0BWecqU8gWfYMnR/17QMXmIL3lSEr9C2aBwUeNYPrGxypwkMe7KxIIHHoqn502roh0bJ/+thV4HsC/x+TWuOhNS8CY9Ob4GmMQI/ik8jjpQlCzypqR0F75XBhHNv5KuZM1h2gQzKplmprf2x8tZxc5AfzpVySh+dx4NT9QJujBPoA534zbQfy5IF5y7wB1dYahkZIgF+AAAAAElFTkSuQmCC"/></Button>
                    <Button className="btn btn-danger me-2" size="sm" onClick={()=> deletedClass(classes.id)}><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAKVJREFUSEvtlbERgzAMRZ8LNqFKVmAMhmAI+oyQyw6ZIQPQwx2zUJBzkcA5CAkfTgMubfk/6duWHYmHS6yPBVABdyERv/ZYS1IDFMALyASRAfAxjQQJAeNOln11/w7YqYBJRjqDWKt+9I4B+FQZ2rY0H2XRCVi8+nO/T4sOYNGWBmh+aC1w2aIMdMA13CM1uxK4AbkR0gM18LQCjLp6mPYn6wpKxBs0qysZAkh0fgAAAABJRU5ErkJggg=="/></Button>
                    <Button className="btn btn-success me-2" size="sm"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAKVJREFUSEu9lUEKwjAQRV/PIRSkC71NL+PGG7QX8iDddCcteA8l0EAMKRkcf7NN5r/8zyTTIF6NWJ9DAT0wAFenqxm4AY+gkzp4ASeneCx/Al0OeG+73ti+dFKxwwERaE0tXtbsQA6w3jw/Z3YgB8gjkgPkEckBexHVXrq5i+QAeUR/B6xA+6tqVrcA5/y7DgNnBC5OyATcSwPHqVsur7WcGyoHfAC5wCwZkHEBmwAAAABJRU5ErkJggg=="/></Button>
              </td>
        </tr>
        ))}
        
      </tbody>
    </Table>
    </div>
    
  )
}
