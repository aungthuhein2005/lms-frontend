import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Card,
  Button,
  OverlayTrigger,
  Tooltip,
  Dropdown,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { useGetExamGradeByStudentIdQuery } from "../../features/api/examApiSlice";

export default function Grades() {
  const { roleId } = useSelector((state) => state.auth.user);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [rangeFilter, setRangeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [gradesMap, setGradesMap] = useState({}); // for editing

  const itemsPerPage = 5;

  const { data: grades = [], isLoading, isError } = useGetExamGradeByStudentIdQuery(roleId);
  console.log(grades);

  if(isLoading) return <p>Loading...</p>
  if(isError) return <p>Error...</p>
  
  const filteredData = grades
    .filter((g) =>
      g.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.examId.toString().includes(searchTerm)
    )
    .filter((g) => {
      const s = g.score;
      switch (rangeFilter) {
        case "100-80": return s <= 100 && s >= 80;
        case "80-60": return s < 80 && s >= 60;
        case "60-40": return s < 60 && s >= 40;
        case "Under 40": return s < 40;
        default: return true;
      }
    });

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedScores = filteredData.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handleGradeChange = (studentId, value) => {
    setGradesMap((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSave = (studentId) => {
    const updatedGrade = gradesMap[studentId];
    // Call API to save grade
    console.log("Saving grade", studentId, updatedGrade);
  };

  const exportToExcel = () => {
    console.log("Exporting to Excel...");
    // export logic goes here
  };

  const semesterOptions = [...new Set(grades.map((g) => g.semester))];

  const gradeTrendData = semesterOptions.map((sem) => {
    const items = grades.filter((g) => g.semester === sem);
    const avg = items.reduce((sum, g) => sum + g.score, 0) / items.length || 0;
    return { semester: sem, average: avg.toFixed(2) };
  });

  return (
    <Container className="my-5">
      <h2 className="fw-bold text-primary">Student Grades</h2>
      <Card className="rounded-4">
        <Card.Body>
          <h5>Student Scores</h5>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                placeholder="🔍 Search by name or ID"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
              />
            </Col>
            <Col md={6} className="d-flex justify-content-end align-items-center">
              <Button variant="success" onClick={exportToExcel}>
                Export Excel
              </Button>
              <Dropdown className="ms-2">
                <Dropdown.Toggle variant="secondary">
                  <i className="bx bx-filter-alt"></i> Filter
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setRangeFilter("ALL")}>All</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRangeFilter("100-80")}>100-80</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRangeFilter("80-60")}>80-60</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRangeFilter("60-40")}>60-40</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRangeFilter("Under 40")}>Under 40</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Exam ID</th>
                <th>Exam Name</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {paginatedScores.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No exam scores found.
                  </td>
                </tr>
              ) : (
                paginatedScores.map((score, index) => (
                  <tr key={index}>
                    <td>{currentPage * itemsPerPage + index + 1}</td>
                    <td>{score.examId}</td>
                    <td>{score.examName}</td>
                    <td>{score.grade}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {pageCount > 1 && (
            <div className="d-flex justify-content-end mt-3">
              {[...Array(pageCount).keys()].map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "primary" : "outline-primary"}
                  size="sm"
                  className="me-2"
                  onClick={() => setCurrentPage(page)}
                >
                  {page + 1}
                </Button>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* <h5 className="mt-4">Grade Trend by Semester</h5>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={gradeTrendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="semester" />
          <YAxis domain={[0, 100]} />
          <ChartTooltip />
          <Line type="monotone" dataKey="average" stroke="#007bff" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer> */}
    </Container>
  );
}
