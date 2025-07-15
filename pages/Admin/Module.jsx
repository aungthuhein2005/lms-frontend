// Module.jsx (Parent Component)
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Accordion, Card } from "react-bootstrap";
import { useDropzone } from "react-dropzone";

// Import the new components
import LessonCard from "../../components/LessonCard";
import LessonModals from "../../components/LessonModals";
import ModuleModals from "../../components/ModuleModals";
import { useSelector } from "react-redux";
import { uploadMedia } from "../../helpers/fileUploader";

const Module = () => {
  const { courseId } = useParams();
  const {role} = useSelector((state) => state.auth.user);
  console.log(role);
  
  
  const [modules, setModules] = useState([]);
  const [course, setCourse] = useState({});
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  // Module state
  const [showAddModule, setShowAddModule] = useState(false);
  const [showEditModule, setShowEditModule] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [eModule, setEModule] = useState({ id: "", name: "", description: "" });

  // Lesson state
  const [lessonsByModule, setLessonsByModule] = useState({}); // Renamed for clarity
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [eLesson, setELesson] = useState({ id: "", title: "", description: "", media: null, mediaPreview: "" }); // Added description, media, mediaPreview
  const [editStatus, setEditStatus] = useState(false);


  // --- Module Handlers ---
  const handleAddModuleShow = () => {
    setModuleName("");
    setModuleDescription("");
    setShowAddModule(true);
  };
  const handleAddModuleClose = () => setShowAddModule(false);

  const handleEditModuleShow = (module) => {
    setEModule(module);
    setModuleName(module.name);
    setModuleDescription(module.description);
    setShowEditModule(true);
  };
  const handleEditModuleClose = () => setShowEditModule(false);

  // --- Lesson Handlers ---
  const handleAddLessonShow = (moduleId) => {
    setELesson({ id: "", title: "", description: "", media: null, mediaPreview: "" });
    setSelectedModuleId(moduleId);
    setShowAddLesson(true);
  };
  const handleAddLessonClose = () => setShowAddLesson(false);

  const editLesson = (lessonToEdit) => {
    setEditStatus(true);
    setELesson(lessonToEdit);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setELesson((prevELesson) => ({
      ...prevELesson,
      media: file,
      mediaPreview: URL.createObjectURL(file),
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': [],
      'image/*': [],
      'application/pdf': [],
      'text/plain': []
    }
  });


  // --- API Calls ---

  useEffect(() => {
    const fetchCourseAndModules = async () => {
      try {
        const courseResponse = await axios.get(
          `http://localhost:8080/courses/view/${courseId}`
        );
        setCourse(courseResponse.data);
        console.log(course);
        

        const modulesResponse = await axios.get(
          `http://localhost:8080/courses/${courseId}/modules`
        );
        setModules(modulesResponse.data);
      } catch (error) {
        console.error("Error fetching course or modules:", error);
      }
    };
    fetchCourseAndModules();
  }, [courseId]);

  const fetchLessons = async (moduleId) => {
    if (!moduleId) {
      console.error("moduleId is undefined!");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/lessons/module/${moduleId}`
      );
      setLessonsByModule((prev) => ({
        ...prev,
        [moduleId]: response.data,
      }));
    } catch (error) {
      console.error(`Error fetching lessons for module ${moduleId}:`, error);
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
    handleAddModuleClose();
  }

  async function updateModule(updatedModule) {
    await axios
      .put(
        `http://localhost:8080/modules/update/${updatedModule.id}`,
        updatedModule
      )
      .then((response) => console.log(response.data));
    await getModulesByCourseId(courseId);
    handleEditModuleClose();
    setEModule({ id: "", name: "", description: "" });
  }

  async function deleteModule(moduleId) {
    axios.delete(`http://localhost:8080/modules/${moduleId}`);
    await getModulesByCourseId(courseId);
  }

  const handleAddLesson = async () => {
    let uploadMediaResult = {};

    if (eLesson.media instanceof File) {
      const result = await uploadMedia(eLesson.media);
      if (result) {
        uploadMediaResult.mediaURL = result.mediaURL;
        uploadMediaResult.mediaFileName = result.mediaFilename;
        uploadMediaResult.mediaType = result.mediaType;
      }
    }

    const newLessonPayload = {
      title: eLesson.title,
      description: eLesson.description,
      mediaURL: uploadMediaResult.mediaURL || "",
      mediaType: uploadMediaResult.mediaType || "",
      meidaFileName: uploadMediaResult.mediaFileName || "unknown",
      examId: null, // You might need to add inputs for these
      assignmentId: null, // You might need to add inputs for these
      module: {
        id: selectedModuleId,
      },
    };

    await createLesson(newLessonPayload);
  };

  async function createLesson(new_lesson_payload) {
    try {
      const response = await axios.post(
        "http://localhost:8080/lessons/create",
        new_lesson_payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setShowAddLesson(false);
      setELesson({ id: "", title: "", description: "", media: null, mediaPreview: "" });
      fetchLessons(new_lesson_payload.module.id);
    } catch (error) {
      console.error("Error creating lesson:", error.response?.data || error.message);
    }
  }

  async function deleteLesson(lessonId, moduleId) {
    await axios.delete(`http://localhost:8080/lessons/${lessonId}`);
    fetchLessons(moduleId);
  }

  async function updateLesson(lessonId, updatedlesson) {
    // This part might need adjustment if you want to handle media updates for lessons
    await axios
      .put(`http://localhost:8080/lessons/${lessonId}`, updatedlesson)
      .then((response) => console.log(response.data));
    fetchLessons(selectedModuleId); // Re-fetch lessons for the active module
    setEditStatus(false);
    setELesson({ id: "", title: "", description: "", media: null, mediaPreview: "" });
  }

  return (
    <>
      <Container className="py-4">
        <Row className="mb-4 p-3 bg-light rounded shadow-sm align-items-center justify-content-between">
  <Col md={8}>
    <h3 className="fw-bold text-primary mb-1">{course.title}</h3>
    <p className="text-muted mb-0">{course.description}</p>
    <small className="text-secondary">Subject: {course.subject?.name}</small>
  </Col>

  <Col md="auto" className="text-end">
    {role === "ADMIN" && (
      <Button variant="outline-primary" className="d-flex align-items-center gap-2" onClick={handleAddModuleShow}>
      <i className="bx bx-message-square-add fs-5"></i>
      <span>Add Module</span>
    </Button>)}
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
                    {role === "ADMIN" && <Button variant="primary" onClick={() => handleAddLessonShow(module.id)}>
                      <i className="bx bx-message-square-add me-2"></i>Add Lesson
                    </Button>}
                    
                  </Col>
                </Row>

                {(lessonsByModule[module.id] && lessonsByModule[module.id].length > 0) ? (
                  lessonsByModule[module.id].map((lessonItem) => (
                    <LessonCard
                      key={lessonItem.id}
                      lessonItem={lessonItem}
                      editStatus={editStatus}
                      eLesson={eLesson}
                      setELesson={setELesson}
                      updateLesson={updateLesson}
                      deleteLesson={deleteLesson}
                      editLesson={editLesson}
                      moduleId={module.id}
                    />
                  ))
                ) : (
                  <div className="text-center text-muted mb-3">There is no lesson.</div>
                )}

                <div className="d-flex justify-content-end">
                  {role === "ADMIN" && (<><Button variant="outline-secondary" className="me-2" onClick={() => handleEditModuleShow(module)}>
                    <i className="bx bxs-edit-alt"></i>
                  </Button>
                  <Button variant="outline-danger" onClick={() => deleteModule(module.id)}>
                    <i className="bx bxs-trash"></i>
                  </Button></>)}
                  
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>

      <ModuleModals
        showAddModule={showAddModule}
        handleAddClose={handleAddModuleClose}
        moduleName={moduleName}
        setModuleName={setModuleName}
        moduleDescription={moduleDescription}
        setModuleDescription={setModuleDescription}
        addModule={addModule}
        showEditModule={showEditModule}
        handleEditClose={handleEditModuleClose}
        eModule={eModule}
        updateModule={updateModule}
      />

      <LessonModals
        showAddLesson={showAddLesson}
        handleAddLessonClose={handleAddLessonClose}
        eLesson={eLesson}
        setELesson={setELesson}
        handleAddLesson={handleAddLesson}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
      />
    </>
  );
};

export default Module;