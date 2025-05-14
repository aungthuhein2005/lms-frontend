import React from 'react';
import { Card, Container, ProgressBar, Row, Col, Badge, Table } from 'react-bootstrap';

const attendanceRecords = [
  { date: '2025-05-01', subject: 'Math', status: 'Present', remark: '' },
  { date: '2025-05-02', subject: 'Science', status: 'Absent', remark: 'Sick leave' },
  { date: '2025-05-03', subject: 'English', status: 'Late', remark: 'Traffic' },
  { date: '2025-05-04', subject: 'History', status: 'Present', remark: '' },
  { date: '2025-05-05', subject: 'Art', status: 'Excused', remark: 'Permission granted' },
];

const getBadgeVariant = (status) => {
  switch (status) {
    case 'Present': return 'success';
    case 'Absent': return 'danger';
    case 'Late': return 'warning';
    case 'Excused': return 'info';
    default: return 'secondary';
  }
};

function Attendances() {
  const total = attendanceRecords.length;
  const present = attendanceRecords.filter(r => r.status === 'Present').length;
  const percentage = Math.round((present / total) * 100);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">My Attendance</h2>

      {/* Summary Card */}
      <Card className="mb-4 shadow rounded-4">
        <Card.Body>
          <h5 className="mb-3">Attendance Summary - This Month</h5>
          <ProgressBar now={percentage} label={`${percentage}%`} striped animated variant="success" className="mb-3" />
          <Row>
            <Col><Badge bg="success">Present: {present}</Badge></Col>
            <Col><Badge bg="danger">Absent: {attendanceRecords.filter(r => r.status === 'Absent').length}</Badge></Col>
            <Col><Badge bg="warning">Late: {attendanceRecords.filter(r => r.status === 'Late').length}</Badge></Col>
            <Col><Badge bg="info">Excused: {attendanceRecords.filter(r => r.status === 'Excused').length}</Badge></Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Table or Recent List */}
      <Card className="shadow-sm rounded-4">
        <Card.Body>
          <h5 className="mb-3">Recent Attendance</h5>
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, idx) => (
                <tr key={idx}>
                  <td>{record.date}</td>
                  <td>{record.subject}</td>
                  <td><Badge bg={getBadgeVariant(record.status)}>{record.status}</Badge></td>
                  <td>{record.remark || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Attendances;
