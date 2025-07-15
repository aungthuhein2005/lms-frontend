import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Modal, Form, Row, Col } from "react-bootstrap";
import { useGetClassByTeacherIdQuery } from "../../features/api/classApiSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function TeacherAssignmentPage() {
  const {roleId} = useSelector((state) => state.auth.user);
  
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    media: "",
    point: 10,
    classId: "",
  });

  const { data: teacherClasses } = useGetClassByTeacherIdQuery(roleId);
  const {lessonId} = useParams();
  const fetchAssignments = async () => {
    const res = await axios.get(
      `http://localhost:8080/assignments/teacher/${roleId}`
    );
    console.log(res);
    
    setAssignments(res.data);
  };
  
  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreate = async () => {
    await axios.post(`http://localhost:8080/assignments/create`, {
      ...formData,
      classId: parseInt(formData.classId),
      teacherId: roleId,
    });
    fetchAssignments();
    setShowModal(false);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      media: "",
      point: 10,
      classId: "",
    });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">📚 Assignments</h3>
        <Button onClick={() => setShowModal(true)} variant="primary">
          ➕ Create Assignment
        </Button>
      </div>

      {/* Assignment Cards */}
      {assignments.length> 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
        {assignments?.map((a) => (
          <Col key={a.id}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="fw-semibold">{a.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Class: {a.classEntity?.name || "N/A"}
                </Card.Subtitle>
                <Card.Text className="small text-secondary">
                  {a.description || "No description"}
                </Card.Text>
                <div className="d-flex flex-column gap-1 mt-2">
                  <div>
                    <strong>Due Date:</strong> {a.dueDate}
                  </div>
                  <div>
                    <strong>Points:</strong> {a.point}
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white text-end">
                <Button
                  size="sm"
                  variant="outline-success"
                  href={`/teacher/assignments/${a.id}/submissions`}
                >
                  📄 View Submissions
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>) : (
        <div className="text-center text-muted mt-5">
          <p>No assignments found.</p>
          </div>)
          }

      {/* Modal for creating assignment */}
<Modal show={showModal} onHide={() => setShowModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title className="fw-bold">📝 Create Assignment</Modal.Title>
  </Modal.Header>

  <Modal.Body className="px-4">
    <Form>
      {/* Title */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Assignment Title</Form.Label>
        <Form.Control
          placeholder="Enter assignment title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />
      </Form.Group>

      {/* Description */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Provide a brief description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </Form.Group>

      {/* Due Date */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Due Date</Form.Label>
        <Form.Control
          type="date"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
          required
        />
      </Form.Group>

      {/* Media URL */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Media / Resource Link</Form.Label>
        <Form.Control
          placeholder="Paste video, file, or document URL"
          value={formData.media}
          onChange={(e) =>
            setFormData({ ...formData, media: e.target.value })
          }
        />
      </Form.Group>

      {/* Points */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Points</Form.Label>
        <Form.Control
          type="number"
          placeholder="e.g. 10"
          value={formData.point}
          onChange={(e) =>
            setFormData({ ...formData, point: e.target.value })
          }
          required
        />
      </Form.Group>

      {/* Class Selection */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Assign to Class</Form.Label>
        <Form.Select
          value={formData.classId}
          onChange={(e) =>
            setFormData({ ...formData, classId: e.target.value })
          }
          required
        >
          <option value="">Choose Class</option>
          {teacherClasses?.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Form>
  </Modal.Body>

  <Modal.Footer className="px-4 pb-3">
    <Button
      variant="outline-secondary"
      onClick={() => setShowModal(false)}
      className="me-2"
    >
      ❌ Cancel
    </Button>
    <Button variant="primary" onClick={handleCreate}>
      ✅ Save Assignment
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}
