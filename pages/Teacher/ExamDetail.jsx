import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card, Spinner, Button, Row, Col, Badge, Dropdown, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Clock, FileText, Star } from "react-bootstrap-icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExamDetailPage = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState({});

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [rangeFilter, setRangeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchExam = async () => {
      const response = await axios.get(`http://localhost:8080/exams/${id}`);
      setExam(response.data);
    };

    const fetchScores = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/exams/${id}/details`);
        setScores(response.data);
        
      } catch (error) {
        console.error("Error fetching student scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
    fetchScores();
  }, [id]);

  const filterByRange = (score) => {
    switch (rangeFilter) {
      case "100-80":
        return score.score >= 80;
      case "80-60":
        return score.score >= 60 && score.score < 80;
      case "60-40":
        return score.score >= 40 && score.score < 60;
      case "Under 40":
        return score.score < 40;
      default:
        return true;
    }
  };

  const filteredScores = scores.filter((score) => {
    const matchSearch =
      (score.studentName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (score.studentId || "").toString().includes(searchTerm.toLowerCase());
    return matchSearch && filterByRange(score);
  });

  const paginatedScores = filteredScores.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const pageCount = Math.ceil(filteredScores.length / itemsPerPage);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredScores.map((s) => ({
        "Student ID": s.studentId,
        "Student Name": s.studentName,
        Score: s.score,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Scores");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "exam-scores.xlsx");
  };

  const handleGradeChange = (studentId, value) => {
  setGrades((prev) => ({
    ...prev,
    [studentId]: value,
  }));
};


  const handleSave = (studentId) => {
  const grade = grades[studentId];
  if (grade) {
    console.log(`Saving grade for student ${studentId}: ${grade}`);
    const response = axios.put(`http://localhost:8080/exams/update_grade`, {
  examId: 2,
  studentId: 3,
  grade: grade,
});

  } else {
    alert("Grade is empty");
  }
};


  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Exam Detail</h2>
        <Button variant="secondary" size="sm" onClick={() => navigate("/teacher/exams")}>
          ← Back to Exams
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : exam ? (
        <>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h4 className="mb-3 text-primary">{exam.title}</h4>
              <Row>
                <Col md={6}>
                  <div className="d-flex align-items-start mb-2">
                    <FileText className="me-2 text-secondary" />
                    <div>
                      <h6 className="mb-0">Description</h6>
                      <small className="text-muted">{exam.description || "No description provided"}</small>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="d-flex align-items-start mb-2">
                    <Clock className="me-2 text-secondary" />
                    <div>
                      <h6 className="mb-0">Duration</h6>
                      <small className="text-muted">{exam.duration} mins</small>
                    </div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="d-flex align-items-start mb-2">
                    <Star className="me-2 text-secondary" />
                    <div>
                      <h6 className="mb-0">Total Score</h6>
                      <Badge bg="info">{exam.score}</Badge>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

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
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedScores.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No student scores found.
                      </td>
                    </tr>
                  ) : (
                    paginatedScores.map((score, index) => (
                      <tr key={index}>
                        <td>{currentPage * itemsPerPage + index + 1}</td>
                        <td>{score.studentId}</td>
                        <td>{score.studentName}</td>
                        <td>{score.score}</td>
                        <td>
  <Form.Control
    size="sm"
    type="text"
    placeholder="Grade"
    value={grades[score.studentId] || score.grade}
    onChange={(e) => handleGradeChange(score.studentId, e.target.value)}
  />
</td>
<td>
  <OverlayTrigger overlay={<Tooltip>Save</Tooltip>}>
    <Button
      variant="outline-success"
      size="sm"
      className="rounded-circle"
      onClick={() => handleSave(score.studentId)}
    >
      <i className="bx bxs-save"></i>
    </Button>
  </OverlayTrigger>
</td>

                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {/* Pagination Controls */}
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
        </>
      ) : (
        <p>Exam details not found.</p>
      )}
    </div>
  );
};

export default ExamDetailPage;
