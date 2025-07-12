import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Button, Modal, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const Subjects = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [eSubject, setESubject] = useState({
    id: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    getSubjects();
  }, []);

  const getSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:8080/subjects/all");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const addSubject = async (newSubject) => {
    try {
      await axios.post("http://localhost:8080/subjects", newSubject);
      setShow(false);
      setName("");
      setDescription("");
      getSubjects();
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const editSubject = (subject) => {
    setEditStatus(true);
    setESubject(subject);
  };

  const updateSubject = async (updatedSubject) => {
    try {
      await axios.put(
        `http://localhost:8080/subjects/${updatedSubject.id}`,
        updatedSubject
      );
      setEditStatus(false);
      setESubject({ id: "", name: "", description: "" });
      getSubjects();
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  const deleteSubject = async (subjectId) => {
    try {
      await axios.delete(`http://localhost:8080/subjects/${subjectId}`);
      getSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  return (
 (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Subjects</h3>
        <Button variant="primary" onClick={() => setShow(true)}>
          <i className="bx bx-message-square-add me-2"></i> Add Subject
        </Button>
      </div>

      {/* Modal for Add Subject */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={() => addSubject({ name, description })}>
            <i className="bx bx-save me-1"></i> Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Subject Table */}
      <Card className="shadow-sm rounded-4">
        <Card.Body>
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) =>
                editStatus && subject.id === eSubject.id ? (
                  <tr key={subject.id}>
                    <td>{subject.id}</td>
                    <td>
                      <Form.Control
                        value={eSubject.name}
                        onChange={(e) =>
                          setESubject({ ...eSubject, name: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        value={eSubject.description}
                        onChange={(e) =>
                          setESubject({ ...eSubject, description: e.target.value })
                        }
                      />
                    </td>
                    <td className="text-end d-flex justify-content-end gap-2">
                      <OverlayTrigger overlay={<Tooltip>Save</Tooltip>}>
                        <Button
                          variant="warning"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => updateSubject(eSubject)}
                        >
                          <i className="bx bx-save"></i>
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => deleteSubject(subject.id)}
                        >
                          <i className="bx bxs-trash"></i>
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ) : (
                  <tr key={subject.id}>
                    <td>{subject.id}</td>
                    <td>{subject.name}</td>
                    <td>{subject.description}</td>
                    <td className="text-end d-flex justify-content-end gap-2">
                      <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => editSubject(subject)}
                        >
                          <i className="bx bxs-edit-alt"></i>
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => deleteSubject(subject.id)}
                        >
                          <i className="bx bxs-trash"></i>
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  ))
};

export default Subjects;