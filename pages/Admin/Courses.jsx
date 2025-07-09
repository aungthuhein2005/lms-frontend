import { useState, useEffect } from "react";
import axios from "axios";
import { useReducer } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
  const [editStatus, setEditStatus] = useState(false);
  const [ecourse, setECourse] = useState({
    id: "",
    title: "",
    description: "",
  });

  async function getCourses() {
    await axios.get(`http://localhost:8080/courses/all`).then((response) => {
      setCourses(response.data);
      // dispatch({ type: "GET_COURSES", payload: response.data });
    });
  }

  useEffect(() => {
    getCourses();
  }, []);

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
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Courses</h3>
        <button className="btn btn-primary" onClick={() => handleShow()}>
          <i className="bx bx-message-square-add"></i> Add Course
        </button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form action="">
              <div className="mt-3">
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Title"
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
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="success"
              onClick={() => addCourse({ title, description })}
            >
              <i className="bx  bx-save"></i> Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) =>
            editStatus && course.id == ecourse.id ? (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>
                  <input
                    type="text"
                    value={ecourse.title}
                    onChange={(e) =>
                      setECourse({ ...ecourse, title: e.target.value })
                    }
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={ecourse.description}
                    onChange={(e) =>
                      setECourse({ ...ecourse, description: e.target.value })
                    }
                    className="form-control"
                  />
                </td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => updateCourse(ecourse)}
                  >
                    <i className="bx  bx-save"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deletedCourse(course.id)}
                  >
                    <i className="bx bxs-trash"></i>
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>
                  <button
                    className="btn btn-primary  me-2"
                    onClick={() => editCourse(course)}
                  >
                    <i className="bx bxs-edit-alt"></i>
                  </button>
                  <button
                    className="btn btn-success  me-2"
                    onClick={() => navigate(`${course.id}/modules`)}
                  >
                    <i className="bx bx-detail"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deletedCourse(course.id)}
                  >
                    <i className="bx bxs-trash"></i>
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;
