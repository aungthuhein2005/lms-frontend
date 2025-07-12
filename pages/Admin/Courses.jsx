import { useState, useEffect, use } from "react";
import axios from "axios";
import { useReducer } from "react";
import { Button, Modal, Table, Form, OverlayTrigger, Tooltip, Card } from 'react-bootstrap';

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Courses = () => {
  const navigate = useNavigate();

  
  useEffect(() => {
    getCourses();
  }, []);
  const [courses, setCourses] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subejctId,setSubjectId] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [ecourse, setECourse] = useState({
    id: "",
    title: "",
    description: "",
  });
  const [subjects, setSubjects] = useState([]);

  async function getCourses() {
    await axios.get(`http://localhost:8080/courses/all`).then((response) => {
      setCourses(response.data);
    });
  }

  const getSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:8080/subjects/all");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    getSubjects();
  }, []);


  useEffect(()=>{
    getCourses();
  },[])

  async function addCourse(new_course) {
    await axios
      .post(`http://localhost:8080/courses/create`, new_course)
      .then((response) => console.log(response.data));
    setShow(false);
    getCourses();
  }

  function editCourse(editedcourse) {
    setEditStatus(true);
    setECourse(editedcourse);
    console.log(editCourse);
  }

  async function updateCourse(updatedCourse) {
    await axios
      .put(
        `http://localhost:8080/courses/update/${updatedCourse.id}`,
        updatedCourse
      )
      .then((response) => console.log(response.data));
    console.log(updateCourse);
    setEditStatus(false);
    setECourse({ id: "", title: "", description: "" });
    getCourses();
  }

  async function deletedCourse(courseId) {
    await axios
      .delete(`http://localhost:8080/courses/${courseId}`)
      .then((response) => console.log(response.data));
    getCourses();
  }

  return (
 <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Courses</h3>
        <Button variant="primary" onClick={handleShow}>
          <i className="bx bx-message-square-add me-2"></i> Add Course
        </Button>
      </div>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Course</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
             <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Select onChange={(e)=> setSubjectId(e.target.value)} value={subejctId}>
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="success" onClick={() => addCourse({ title, description, subjectId: parseInt(subejctId) })}>
              <i className="bx bx-save me-2"></i> Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Table Card */}
      <Card className="shadow-sm rounded-4">
        <Card.Body>
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) =>
                editStatus && course.id === ecourse.id ? (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>
                      <Form.Control
                        type="text"
                        value={ecourse.title}
                        onChange={(e) =>
                          setECourse({ ...ecourse, title: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={ecourse.description}
                        onChange={(e) =>
                          setECourse({ ...ecourse, description: e.target.value })
                        }
                      />
                    </td>
                    <td className="text-end d-flex justify-content-end gap-2">
                      <OverlayTrigger overlay={<Tooltip>Save</Tooltip>}>
                        <Button
                          variant="warning"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => updateCourse(ecourse)}
                        >
                          <i className="bx bx-save"></i>
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => deletedCourse(course.id)}
                        >
                          <i className="bx bxs-trash"></i>
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ) : (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.title}</td>
                    <td>{course.description}</td>
                    <td className="text-end d-flex justify-content-end gap-2">
                      <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => editCourse(course)}
                        >
                          <i className="bx bxs-edit-alt"></i>
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Modules</Tooltip>}>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => navigate(`${course.id}/modules`)}
                        >
                          <i className="bx bx-detail"></i>
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => deletedCourse(course.id)}
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
  );
};

export default Courses;