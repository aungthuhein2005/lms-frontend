import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Card, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";

export default function ViewSubmissions() {
  const { assignmentId } = useParams(); // passed from route
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scoreUpdates, setScoreUpdates] = useState({});

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/assignments/${assignmentId}/submissions`
      );
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const handleScoreChange = (id, value) => {
    setScoreUpdates({ ...scoreUpdates, [id]: value });
  };

  const handleSaveScore = async (submissionId) => {
    try {
      await axios.patch(`http://localhost:8080/submissions/${submissionId}/score`, {
        score: scoreUpdates[submissionId],
      });
      fetchSubmissions(); // Refresh
    } catch (err) {
      console.error("Failed to save score", err);
    }
  };

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">View Submissions</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <p className="text-muted">No student has submitted this assignment yet.</p>
      ) : (
        <Card className="shadow-sm rounded-4">
          <Card.Body>
            <Table hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Student Name</th>
                  <th>Submitted At</th>
                  <th>File</th>
                  <th>Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.student.name}</td>
                    <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                    <td>
                      <a href={sub.fileUrl} target="_blank" rel="noreferrer">
                        View File
                      </a>
                    </td>
                    <td style={{ maxWidth: 120 }}>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="Score"
                        value={scoreUpdates[sub.id] ?? sub.score ?? ""}
                        onChange={(e) => handleScoreChange(sub.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <Button size="sm" variant="primary" onClick={() => handleSaveScore(sub.id)}>
                        Save
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
