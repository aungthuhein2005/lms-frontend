// StudentAssignmentDetail.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Form } from "react-bootstrap";

export default function StudentAssignmentDetail({ assignmentId, studentId }) {
  const [assignment, setAssignment] = useState({});
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    axios.get(`/assignments/lesson/${assignmentId}`).then(res => {
      const found = res.data.find(a => a.id === parseInt(assignmentId));
      if (found) setAssignment(found);
    });
  }, []);

  const handleSubmit = async () => {
    await axios.post(`/assignments/${assignmentId}/submit/${studentId}`, { fileUrl });
    alert("Assignment submitted!");
  };

  return (
    <div className="container py-4">
      <Card>
        <Card.Body>
          <h4>{assignment.title}</h4>
          <p>{assignment.description}</p>
          <p><strong>Due:</strong> {assignment.dueDate}</p>
          <p><strong>Points:</strong> {assignment.point}</p>
          {assignment.media && <a href={assignment.media} target="_blank">📎 View Media</a>}
          <Form.Control className="my-3" placeholder="Submission File URL" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
          <Button onClick={handleSubmit}>📤 Submit</Button>
        </Card.Body>
      </Card>
    </div>
  );
}
