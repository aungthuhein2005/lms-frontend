import React from 'react'
import { Badge, Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';

export default function ExamCard({exam}) {
    const navigate = useNavigate();
    const {role} = useSelector(state=>state.auth.user);
  return (
            
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">{exam.title}</h5>
                  <p className="card-text mb-2">
                    <span className="badge bg-secondary me-2">
                      Duration: {exam.duration} min
                    </span>
                    <span className="badge bg-info text-dark">
                      Score: {exam.score}
                    </span>
                  </p>
                  <p className="text-muted mb-3">{exam.description}</p>
                  <div className="d-flex justify-content-end gap-2">
                    {role === 'TEACHER' && (       <>
  <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
    <Link to={`/teacher/exams/edit/${exam.id}`}>
      <Button variant="outline-primary" size="sm"
      className="rounded-circle">
        <i className="bx bxs-edit"></i>
      </Button>
    </Link>
  </OverlayTrigger>

  <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}>
    <Button
      variant="outline-success"
      size="sm"
      className="rounded-circle"
      onClick={() => navigate(`/teacher/exams/${exam.id}/details`)}
    >
      <i className="bx bx-show-alt"></i>
    </Button>
  </OverlayTrigger>

  <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
    <Button
      variant="outline-danger"
      size="sm"
      className="rounded-circle"
      onClick={() => deleteExam(exam.id)}
    >
      <i className="bx bxs-trash-alt"></i>
    </Button>
  </OverlayTrigger></>          
)}
{role === 'STUDENT' && (<Button
                  variant="primary"
                  size='sm'
                  onClick={() => navigate(`/student/exams/${exam.id}/attempt`)}
                  disabled={exam.status === "Completed"}
                >
                  Attempt
                </Button>)}
                </div>
                </div>
              </div>
  )
}
