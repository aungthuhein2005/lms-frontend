import React from 'react';
import { Container, Table, Badge } from 'react-bootstrap';

const grades = [
  { subject: 'Math', grade: 92, status: 'Pass', comment: 'Excellent work!' },
  { subject: 'English', grade: 78, status: 'Pass', comment: 'Good understanding' },
  { subject: 'History', grade: 65, status: 'Pass', comment: 'Needs more detail' },
  { subject: 'Science', grade: 49, status: 'Fail', comment: 'Incomplete assignments' },
  { subject: 'Art', grade: 88, status: 'Pass', comment: '' },
];

function Grades() {
  return (
    <Container className="">
      <h2 className="mb-4">My Grades</h2>
      <Table bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Exam</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{g.subject}</td>
              <td>{g.grade}</td>
              <td>
                <Badge bg={g.status === 'Pass' ? 'success' : 'danger'}>
                  {g.status}
                </Badge>
              </td>
              <td>{g.comment || '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Grades;
