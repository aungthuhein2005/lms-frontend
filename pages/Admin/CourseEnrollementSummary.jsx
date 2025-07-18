import React, { useState } from "react";
import { Container, Card, Table, Row, Col, Form, Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useGetCourseEnrollmentSummaryQuery } from "../../features/api/adminDashboardApiSlice";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
const courseEnrollmentData = [
  { course: "Java OOP", totalEnrollment: 80 },
  { course: "React JS", totalEnrollment: 65 },
  { course: "Data Structures", totalEnrollment: 50 },
  { course: "Python Basics", totalEnrollment: 90 },
];

export default function CourseEnrollmentSummary() {

      const [searchTerm, setSearchTerm] = useState("");
      const {data,isLoading,isError} = useGetCourseEnrollmentSummaryQuery();
    
            if(isLoading) return <Loading/>
      if(isError) return <ErrorMessage/>

      const filteredCourses = data.filter((record) =>
        record.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredCourses);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Course Enrollment");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "student-grades-report.xlsx");
      };

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-success mb-4">📘 Course Enrollment Summary</h2>
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
          <Table hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>Total Enrolled Students</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{course.courseName}</td>
                  <td>{course.studentCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
