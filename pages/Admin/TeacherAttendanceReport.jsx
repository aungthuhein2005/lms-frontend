import React, { useState } from "react";
import { Container, Card, Table, Row, Col, Form, Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const teacherAttendanceData = [
  { teacher: "John Smith", totalClasses: 40, attended: 38 },
  { teacher: "Alice Johnson", totalClasses: 42, attended: 41 },
  { teacher: "Bob Williams", totalClasses: 39, attended: 37 },
  { teacher: "Emily Brown", totalClasses: 44, attended: 44 },
];

export default function TeacherAttendanceReport() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = teacherAttendanceData.filter((record) =>
    record.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teacher Attendance");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "teacher-attendance-report.xlsx");
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-primary mb-4">📋 Teacher Attendance Report</h2>
      <Card className="shadow-sm rounded-4">
        <Card.Body>
          <Row className="mb-4 align-items-end">
            <Col md={4}>
              <Form.Control
                placeholder="🔍 Search by teacher name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={{ span: 3, offset: 5 }} className="text-end">
              <Button variant="primary" onClick={exportToExcel}>
                <i className="bx bx-download me-1"></i> Export Excel
              </Button>
            </Col>
          </Row>

          <Table hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Teacher</th>
                <th>Total Classes</th>
                <th>Attended</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record, index) => {
                const attendanceRate = ((record.attended / record.totalClasses) * 100).toFixed(1);
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record.teacher}</td>
                    <td>{record.totalClasses}</td>
                    <td>{record.attended}</td>
                    <td>{attendanceRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
