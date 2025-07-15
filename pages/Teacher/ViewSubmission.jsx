import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Card, Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useGetSubmiteddAssignementsByAssignementIdQuery, useUpdateScoreMutation } from "../../features/api/assignementApiSlice";

export default function ViewSubmissions() {
  const { assignmentId } = useParams();
  const [scoreUpdates, setScoreUpdates] = useState({});
  const {data: submissions, isLoading} = useGetSubmiteddAssignementsByAssignementIdQuery(assignmentId);
  console.log(submissions);
  const [updateScore] = useUpdateScoreMutation();
  

  const handleScoreChange = (id, value) => {
    setScoreUpdates({ ...scoreUpdates, [id]: value });
  };

  // const handleSaveScore = async (submissionId) => {
  //   try {
  //     await axios.patch(`http://localhost:8080/assignments/submissions/${submissionId}/score`, {
  //       score: scoreUpdates[submissionId],
  //     });
  //   } catch (err) {
  //     console.error("Failed to save score", err);
  //   }
  // };

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">View Submissions</h3>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <p className="text-muted">No student has submitted this assignment yet.</p>
      ) : (
        <Card className="shadow-sm rounded-4">
          <Card.Body>
<Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
                <tr>
                  <th>Student ID</th>
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
                    <td>{sub.student.id}</td>
                    <td>{sub.student.user.name}</td>
                    <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                    <td>
                      <Link to={`http://localhost:8080${sub.submittedFile}`} target="_blank" rel="noreferrer">
                        View File
                      </Link>
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
                                            <OverlayTrigger overlay={<Tooltip>Save</Tooltip>}>
                                              <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="rounded-circle"
                                                onClick={() => updateScore({ submissionId: sub.id, score: scoreUpdates[sub.id] || sub.score })}
                                              >
                                                <i class='bx bxs-save'></i>
                                              </Button>
                                            </OverlayTrigger>
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
