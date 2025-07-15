import { useState } from "react";
import { Table, Button, Modal, Form, Badge, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";

const GradingPage = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [gradeInput, setGradeInput] = useState('');

  const [grades, setGrades] = useState([
    { id: 1, examName: 'Midterm Exam', grade: 85, examDate: '2023-10-01' },
    { id: 2, examName: 'Final Exam', grade: 90, examDate: '2023-12-15' },
  ]);

  const handleEdit = (grade) => {
    setSelectedGrade(grade);
    setGradeInput(grade.grade);
    setShowModal(true);
  };

  const handleSave = () => {
    setGrades((prev) =>
      prev.map((g) =>
        g.id === selectedGrade.id ? { ...g, grade: parseInt(gradeInput) } : g
      )
    );
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold mb-4">📝 Grading - Class #{id}</h3>

      <Card className="p-4 shadow-sm rounded-4">
        <Table responsive hover className="mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Exam Name</th>
              <th>Grade</th>
              <th>Exam Date</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, index) => (
              <tr key={grade.id}>
                <td>{index + 1}</td>
                <td>{grade.examName}</td>
                <td>
                  <Badge bg={grade.grade >= 50 ? "success" : "danger"}>
                    {grade.grade}%
                  </Badge>
                </td>
                <td>{grade.examDate}</td>
                <td className="text-end">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(grade)}
                  >
                    <i className="bx bx-edit-alt me-1"></i> Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Edit Grade Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Grade - {selectedGrade?.examName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter Grade (%)</Form.Label>
            <Form.Control
              type="number"
              min={0}
              max={100}
              value={gradeInput}
              onChange={(e) => setGradeInput(e.target.value)}
              placeholder="e.g., 85"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Grade
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GradingPage;
