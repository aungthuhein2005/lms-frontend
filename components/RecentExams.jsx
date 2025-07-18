// RecentExamsCard.jsx
import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function RecentExamsCard({ exams }) {
  // Limit to 4 recent exams
  const recentExams = exams.slice(0, 4);

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-transparent border-0 pt-3 pb-2">
        <h5 className="fw-bold mb-0">📝 Recent Exams</h5>
      </Card.Header>
      <Card.Body className="pt-2">
        {recentExams.length === 0 ? (
          <div className="text-muted">No recent exams.</div>
        ) : (
          <ListGroup variant="flush">
            {recentExams.map((exam, idx) => (
              <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                <div>
                  <Link to={`/exams/${exam.id}`} className="fw-semibold text-decoration-none">
                    {exam.title}
                  </Link>
                  <div className="small text-muted">{new Date(exam.dueDate).toLocaleDateString()}</div>
                </div>
                <Badge bg="primary" pill>
                  {exam.subject || "General"}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}
