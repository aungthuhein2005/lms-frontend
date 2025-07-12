import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Modal, Form, Row, Col } from "react-bootstrap";
import { useGetClassByTeacherIdQuery } from "../../features/api/classApiSlice";
import { useParams } from "react-router-dom";

export default function TeacherAssignmentPage() {
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

  const { data: teacherClasses } = useGetClassByTeacherIdQuery(1);
  const {lessonId} = useParams();
  const fetchAssignments = async () => {
    const res = await axios.get(
      `http://localhost:8080/assignments/teacher/${1}`
    );
    setAssignments(res.data);
  };
  
  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreate = async () => {
    await axios.post(`http://localhost:8080/assignments/create`, {
      ...formData,
      classId: parseInt(formData.classId),
      teacherId: 1,
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
      </Row>

      {/* Modal for creating assignment */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              className="mb-2"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Form.Control
              className="mb-2"
              as="textarea"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <Form.Control
              className="mb-2"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
            />
            <Form.Control
              className="mb-2"
              placeholder="Media URL"
              value={formData.media}
              onChange={(e) =>
                setFormData({ ...formData, media: e.target.value })
              }
            />
            <Form.Control
              className="mb-2"
              type="number"
              value={formData.point}
              onChange={(e) =>
                setFormData({ ...formData, point: e.target.value })
              }
            />
            <Form.Group className="mb-3">
              <Form.Label>Select Class</Form.Label>
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
        <Modal.Footer>
          <Button onClick={handleCreate}>✅ Save Assignment</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
