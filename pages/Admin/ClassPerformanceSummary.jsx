import React, { useState } from "react";
import { Container, Card, Table, Row, Col, Form ,Button} from "react-bootstrap";
import { useGetClassPerformanceSummaryQuery } from "../../features/api/adminDashboardApiSlice";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const classPerformanceData = [
  { class: "Java Class A", totalStudents: 25, averageGrade: "A-" },
  { class: "Python Class B", totalStudents: 20, averageGrade: "B+" },
  { class: "Web Dev Class C", totalStudents: 30, averageGrade: "B" },
];

export default function ClassPerformanceSummary() {

      const [searchTerm, setSearchTerm] = useState("");
      const {data,isLoading,isError} = useGetClassPerformanceSummaryQuery();
      console.log(data);
      
      if(isLoading) return <Loading/>
      if(isError) return <ErrorMessage/>
      
    
const filteredClasses = data.filter((record) =>
  record.className.toLowerCase().includes(searchTerm.toLowerCase())
);

    
      const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredClasses);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Classes performance");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "student-grades-report.xlsx");
      };
  return (
    <Container className="py-5">
      <h2 className="fw-bold text-primary mb-4">📊 Class Performance Summary</h2>
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
                <th>Class</th>
                <th>Total Students</th>
                <th>Average Score</th>
                {/* <th>Assignment Count</th>
                <th>Exam Count</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((cls, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{cls.className}</td>
                  <td>{cls.studentCount}</td>
                  <td>{cls.averageScore}</td>
                  {/* <td>{cls.assignmentCount}</td>
                  <td>{cls.examCount}</td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
