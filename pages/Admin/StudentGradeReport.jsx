import React, { useState } from "react";
import { Card, Table, Form, Row, Col, Button, Container } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useGetStudentGradeReportQuery } from "../../features/api/adminDashboardApiSlice";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";


export default function StudentGradesReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const {data,isLoading,isError} = useGetStudentGradeReportQuery();
  
  if(isLoading) return <Loading/>;
  if(isError) return <ErrorMessage/>

  const filteredGrades = data.filter((record) =>
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredGrades);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Grades");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "student-grades-report.xlsx");
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-primary mb-4">🎓 Student Grades Report</h2>

      <Card className="shadow-sm rounded-4">
        <Card.Body>
          <Row className="mb-4 align-items-end">
            <Col md={4}>
              <Form.Control
                placeholder="🔍 Search by student name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={{ span: 3, offset: 5 }} className="text-end">
              <Button variant="success" onClick={exportToExcel}>
                <i className="bx bx-download me-1"></i> Export Excel
              </Button>
            </Col>
          </Row>

          <Table responsive hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredGrades.map((record, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record.studentName}</td>
                    <td>{record.className}</td>
                    <td>{record.subject}</td>
                    <td>{record.grade}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
