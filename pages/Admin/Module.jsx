import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Card, Container, Row, Col, Accordion } from "react-bootstrap";

const Module = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [showAddModule, setShowAddModule] = useState(false);
  const [showEditModule, setShowEditModule] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lesson, setLesson] = useState([]);
  const [eModule, setEModule] = useState({
    id: "",
    name: "",
    description: "",
  });
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [title, setTitle] = useState("");
  const [media, setMedia] = useState("");
  const [eLesson, setELesson] = useState({
    id: "",
    title: "",
    media: "",
  });
  const [editStatus, setEditStatus] = useState(false);
  function editLesson(editedlesson) {
    setEditStatus(true);
    setELesson(editedlesson);
  }

  const handleAddShow = () => {
    setName("");
    setDescription("");
    setShowAddModule(true);
  };
  const handleAddClose = () => setShowAddModule(false);
  const handleEditShow = (module) => {
    setEModule(module);
    setName(module.name);
    setDescription(module.description);
    setShowEditModule(true);
  };
  const handleEditClose = () => setShowEditModule(false);

  const AddLessonShow = (moduleId) => {
    setTitle("");
      setSelectedModuleId(moduleId);
    setMedia("");
    setShowAddLesson(true);
  };
  const AddLessonClose = () => setShowAddLesson(false);

  useEffect(() => {
    const fetchCourseAndModules = async () => {
      const courseResponse = await axios.get(
        `http://localhost:8080/courses/view/${courseId}`
      );
      console.log(courseResponse.data);
      setCourse(courseResponse.data);

      const modulesResponse = await axios.get(
        `http://localhost:8080/courses/${courseId}/modules`
      );
      setModules(modulesResponse.data);
    };
    fetchCourseAndModules();
  }, [courseId]);

  const fetchLessons = async (moduleId) => {
    console.log("Fetching lessons for moduleId:", moduleId);
    if (!moduleId) {
      console.error("moduleId is undefined!");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/lessons/module/${moduleId}`
      );
      setLesson((prev) => ({
        ...prev,
        [moduleId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };
  useEffect(() => {
    if (modules.length > 0) {
      modules.forEach((module) => fetchLessons(module.id));
    }
  }, [modules]);

  async function getModulesByCourseId(courseId) {
    const response = await axios.get(
      `http://localhost:8080/modules/courses/${courseId}`
    );
    setModules(response.data);
  }
  async function addModule(new_module) {
    await axios
      .post(`http://localhost:8080/modules/courses/${courseId}`, new_module)
      .then((response) => console.log(response.data));
    await getModulesByCourseId(courseId);
    setShowAddModule(false);
    setEModule({ id: "", name: "", description: "" });
  }
  async function updateModule(updatedModule) {
    await axios
      .put(
        `http://localhost:8080/modules/update/${updatedModule.id}`,
        updatedModule
      )
      .then((response) => console.log(response.data));
    await getModulesByCourseId(courseId);
    setShowEditModule(false);
    setEditStatus(false);
    setEModule({ id: "", name: "", description: "" });
  }
  async function deletedModule(moduleId) {
    axios.delete(`http://localhost:8080/modules/${moduleId}`);
    await getModulesByCourseId(courseId);
  }

  async function addLesson(new_lesson) {
    try {
      const payload = {
        title: new_lesson.title,
        media: new_lesson.media,
        module: {
          id: new_lesson.moduleId,
        },
      };
      const response = await axios.post(
        `http://localhost:8080/lessons/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setShowAddLesson(false);
      setELesson({ id: "", title: "", media: "" });
      fetchLessons(new_lesson.moduleId);
    } catch (error) {
      console.error(
        "Error creating lesson:",
        error.response?.data || error.message
      );
    }
  }

  async function deletedLesson(lessonId, moduleId) {
    await axios.delete(`http://localhost:8080/lessons/${lessonId}`);
    fetchLessons(moduleId);
  }

  async function updateLesson(lessonId, updatedlesson) {
    await axios
      .put(`http://localhost:8080/lessons/${lessonId}`, updatedlesson)
      .then((response) => console.log(response.data));
    fetchLessons(lessonId);
    setEditStatus(false);
    setELesson({ id: "", title: "", media: "" });
  }


return (
  <>
    <Container className="py-4">
      <Row className="mb-4 align-items-center justify-content-between">
        <Col>
          <h3>{course.title}</h3>
          <p className="text-muted">{course.description}</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleAddShow}>
            <i className="bx bx-message-square-add me-2"></i>Add Module
          </Button>
        </Col>
      </Row>

      <Accordion alwaysOpen>
        {modules.map((module, idx) => (
          <Accordion.Item eventKey={String(idx)} key={module.id} className="mb-3">
            <Accordion.Header>
              <div>
                <h5 className="mb-1">{module.name}</h5>
                <small className="text-muted">{module.description}</small>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <Row className="mb-3 justify-content-end">
                <Col xs="auto">
                  <Button variant="primary" onClick={()=>AddLessonShow(module.id)}>
                    <i className="bx bx-message-square-add me-2"></i>Add Lesson
                  </Button>
                </Col>
              </Row>

              {(lesson[module.id] || []).map((lessonItem) =>
                editStatus && lessonItem.id === eLesson.id ? (
                  <Card key={lessonItem.id} className="mb-3">
                    <Card.Body>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={eLesson.title}
                        onChange={(e) => setELesson({ ...eLesson, title: e.target.value })}
                        placeholder="Lesson Title"
                      />
                      <input
                        type="text"
                        className="form-control mb-3"
                        value={eLesson.media}
                        onChange={(e) => setELesson({ ...eLesson, media: e.target.value })}
                        placeholder="Media"
                      />
                      <div className="d-flex justify-content-end">
                        <Button variant="success" className="me-2" onClick={() => updateLesson(lessonItem.id, eLesson)}>
                          <i className="bx bx-save"></i>
                        </Button>
                        <Button variant="danger" onClick={() => deletedLesson(lessonItem.id, module.id)}>
                          <i className="bx bxs-trash"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ) : (
                  <Card key={lessonItem.id} className="mb-3">
                    <Card.Body>
                      <Card.Title>{lessonItem.title}</Card.Title>
                      <Card.Text>Media: {lessonItem.media}</Card.Text>
                      <div className="d-flex justify-content-end">
                        <Button variant="outline-primary" className="me-2" onClick={() => editLesson(lessonItem)}>
                          <i className="bx bxs-edit-alt"></i>
                        </Button>
                        <Button variant="outline-danger" onClick={() => deletedLesson(lessonItem.id, module.id)}>
                          <i className="bx bxs-trash"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                )
              )}

              <div className="d-flex justify-content-end">
                <Button variant="outline-secondary" className="me-2" onClick={() => handleEditShow(module)}>
                  <i className="bx bxs-edit-alt"></i>
                </Button>
                <Button variant="outline-danger" onClick={() => deletedModule(module.id)}>
                  <i className="bx bxs-trash"></i>
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>

    {/* Add Module Modal */}
    <Modal show={showAddModule} onHide={handleAddClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Module</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Module Name"
        />
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Module Description"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleAddClose}>Close</Button>
        <Button variant="success" onClick={() => addModule({ name, description })}>
          <i className="bx bx-save"></i> Save
        </Button>
      </Modal.Footer>
    </Modal>

    {/* Edit Module Modal */}
    <Modal show={showEditModule} onHide={handleEditClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Module</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Module Name"
        />
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Module Description"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleEditClose}>Close</Button>
        <Button variant="success" onClick={() => updateModule({ id: eModule.id, name, description })}>
          <i className="bx bx-save"></i> Update
        </Button>
      </Modal.Footer>
    </Modal>

    {/* Add Lesson Modal */}
    <Modal show={showAddLesson} onHide={AddLessonClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Lesson</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          className="form-control mb-3"
          value={eLesson.title}
          onChange={(e) => setELesson({ ...eLesson, title: e.target.value })}
          placeholder="Lesson Title"
        />
        <input
          type="text"
          className="form-control"
          value={eLesson.media}
          onChange={(e) => setELesson({ ...eLesson, media: e.target.value })}
          placeholder="Media URL"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={AddLessonClose}>Close</Button>
        <Button
          variant="success"
          onClick={() => addLesson({ title: eLesson.title, media: eLesson.media, moduleId: selectedModuleId })} // Ensure selectedModuleId is defined
        >
          <i className="bx bx-save"></i> Save
        </Button>
      </Modal.Footer>
    </Modal>
  </>
);

};

export default Module;