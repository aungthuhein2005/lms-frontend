import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Card } from "react-bootstrap";

const Module = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState([]);
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

  const AddLessonShow = () => {
    setTitle("");
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
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>{course.title}</h3>
          <button className="btn btn-primary" onClick={() => handleAddShow()}>
            <i className="bx bx-message-square-add"></i> Add Module
          </button>
          <Modal show={showAddModule} onHide={handleAddClose}>
            <Modal.Header closeButton>
              <Modal.Title>Module</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form action="">
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
              <Button variant="secondary" onClick={handleAddClose}>
                Close
              </Button>
              <Button
                variant="success"
                onClick={() => addModule({ name, description })}
              >
                <i className="bx  bx-save"></i> Save
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div className="card border">
          <div className="card-header bg-light">
            <p className="mb-2  pb-2"> {course.description}</p>
          </div>
        </div>

        <div className="accordion mt-3 " id="accordionExample">
          {modules.map((module) => (
            <div className="accordion-item mt-3" key={module.id}>
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h3>{module.name}</h3>
                    <p>{module.description}</p>
                  </div>
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <strong>
                    <div className="container">
                      <div className="d-flex justify-content-end mb-3">
                        <button
                          className="btn btn-primary"
                          onClick={() => AddLessonShow()}
                        >
                          <i className="bx bx-message-square-add"></i> Add
                          Lesson
                        </button>
                        <Modal show={showAddLesson} onHide={AddLessonClose}>
                          <Modal.Header closeButton>
                            <Modal.Title>Lesson</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <form action="">
                              <div className="mt-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={eLesson.title}
                                  onChange={(e) =>
                                    setELesson({
                                      ...eLesson,
                                      title: e.target.value,
                                    })
                                  }
                                  placeholder="Enter Title"
                                />
                              </div>
                              <div className="mt-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={eLesson.media}
                                  onChange={(e) =>
                                    setELesson({
                                      ...eLesson,
                                      media: e.target.value,
                                    })
                                  }
                                  placeholder="Media"
                                />
                              </div>
                            </form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="secondary"
                              onClick={AddLessonClose}
                            >
                              Close
                            </Button>
                            <Button
                              variant="success"
                              onClick={() =>
                                addLesson({
                                  title: eLesson.title,
                                  media: eLesson.media,
                                  moduleId: module.id,
                                })
                              }
                            >
                              <i className="bx  bx-save"></i> Save
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                      {modules.map((module) => (
                        <div key={module.id}>
                          <ul>
                            {(lesson[module.id] || []).map((lesson) =>
                              editStatus && lesson.id == eLesson.id ? (
                                <Card key={lesson.id} className="mb-3">
                                  <Card.Body>
                                    <Card.Title>
                                      <input
                                        type="text"
                                        value={eLesson.title}
                                        onChange={(e) =>
                                          setELesson({
                                            ...eLesson,
                                            title: e.target.value,
                                          })
                                        }
                                      />
                                    </Card.Title>
                                    <Card.Text>
                                      <input
                                        type="text"
                                        value={eLesson.media}
                                        onChange={(e) =>
                                          setELesson({
                                            ...eLesson,
                                            media: e.target.value,
                                          })
                                        }
                                      />
                                    </Card.Text>
                                    <div>
                                      <button
                                        className="btn btn-success me-2"
                                        onClick={() =>
                                          updateLesson(lesson.id, eLesson)
                                        }
                                      >
                                        <i className="bx  bx-save"></i>
                                      </button>
                                      <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                          deletedLesson(lesson.id, module.id)
                                        }
                                      >
                                        <i className="bx bxs-trash"></i>
                                      </button>
                                    </div>
                                  </Card.Body>
                                </Card>
                              ) : (
                                <Card key={lesson.id} className="mb-3">
                                  <Card.Body>
                                    <Card.Title>{lesson.title}</Card.Title>
                                    <Card.Text>Media: {lesson.media}</Card.Text>
                                    <div>
                                      <button
                                        className="btn btn-primary me-2"
                                        onClick={() => editLesson(lesson)}
                                      >
                                        <i className="bx bxs-edit-alt"></i>
                                      </button>
                                      <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                          deletedLesson(lesson.id, module.id)
                                        }
                                      >
                                        <i className="bx bxs-trash"></i>
                                      </button>
                                    </div>
                                  </Card.Body>
                                </Card>
                              )
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-primary  me-2"
                        onClick={() => handleEditShow(module)}
                      >
                        <i className="bx bxs-edit-alt"></i>
                      </button>
                      <Modal show={showEditModule} onHide={handleEditClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Module</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <form action="">
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
                          <Button variant="secondary" onClick={handleEditClose}>
                            Close
                          </Button>
                          <Button
                            variant="success"
                            onClick={() =>
                              updateModule({
                                id: eModule.id,
                                name: name,
                                description: description,
                              })
                            }
                          >
                            <i className="bx  bx-save"></i> Update
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <button
                        className="btn btn-danger"
                        onClick={() => deletedModule(module.id)}
                      >
                        <i className="bx bxs-trash"></i>
                      </button>
                    </div>
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Module;
