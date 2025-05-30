import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
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
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Subjects</h3>
        <Button variant="primary" onClick={() => setShow(true)}>
          <i className="bx bx-message-square-add"></i> Add Subject
        </Button>
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Subject</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mt-3">
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                />
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => addSubject({ name , description })}
            >
              <i className="bx bx-save"></i> Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) =>
            editStatus && subject.id === eSubject.id ? (
              <tr key={subject.id}>
                <td>{subject.id}</td>
                <td>
                  <input
                    type="text"
                    value={eSubject.name}
                    onChange={(e) =>
                      setESubject({ ...eSubject, name: e.target.value })
                    }
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={eSubject.description}
                    onChange={(e) =>
                      setESubject({ ...eSubject, description: e.target.value })
                    }
                    className="form-control"
                  />
                </td>
                <td className="d-flex">
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => updateSubject(eSubject)}
                  >
                    <i className="bx bx-save"></i>
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => deleteSubject(subject.id)}
                  >
                    <i className="bx bxs-trash"></i>
                  </Button>
                </td>
              </tr>
            ) : (
              <tr key={subject.id}>
                <td>{subject.id}</td>
                <td>{subject.name}</td>
                <td>{subject.description}</td>
                <td className="d-flex">
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={() => editSubject(subject)}
                  >
                    <i className="bx bxs-edit-alt"></i>
                  </Button>
                  {/* <Button
                    variant="success"
                    className="me-2"
                    onClick={() => navigate(`${subject.id}/details`)}
                  >
                    <i className="bx bx-detail"></i>
                  </Button> */}
                  <Button
                    variant="danger"
                    onClick={() => deleteSubject(subject.id)}
                  >
                    <i className="bx bxs-trash"></i>
                  </Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Subjects;
