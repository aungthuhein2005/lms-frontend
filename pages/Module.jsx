import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

const Module = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState([]);
  const [showAddModule, setShowAddModule] = useState(false);
  const [showEditModule, setShowEditModule] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [eModule, setEModule] = useState({
    id: "",
    name: "",
    description: "",
  });
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
    await axios.delete(`http://localhost:8080/modules/${moduleId}`);
    await getModulesByCourseId(courseId);
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

        <div className="accordion  mt-3" id="accordionExample">
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
                  <h3>{module.name}</h3>
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>{module.description}</p>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Module;
