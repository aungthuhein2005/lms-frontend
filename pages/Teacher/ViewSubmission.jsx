import React, { useEffect, useState } from "react";
import {
  Table, Spinner, Card, Button, Form, OverlayTrigger, Tooltip,
  Row, Col, Dropdown
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useGetSubmiteddAssignementsByAssignementIdQuery, useUpdateScoreMutation } from "../../features/api/assignementApiSlice";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ViewSubmissions() {
  const { assignmentId } = useParams();
  const [scoreUpdates, setScoreUpdates] = useState({});
  const [updateScore] = useUpdateScoreMutation();
  const { data: submissions = [], isLoading } = useGetSubmiteddAssignementsByAssignementIdQuery(assignmentId);

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // Filtered & paginated data
  const filteredSubmissions = submissions.filter((sub) => {
    const nameMatch = sub.student.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = sub.student.user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = roleFilter === "ALL" || sub.student.user.role === roleFilter;
    return (nameMatch || emailMatch) && roleMatch;
  });

  const pageCount = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  const handleScoreChange = (id, value) => {
    setScoreUpdates({ ...scoreUpdates, [id]: value });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredSubmissions.map((sub) => ({
        Name: sub.student.user.name,
        Email: sub.student.user.email,
        Role: sub.student.user.role,
        SubmittedAt: new Date(sub.submittedAt).toLocaleString(),
        Score: sub.score || 0,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "submissions.xlsx");
  };

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">📄 View Submissions</h3>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <p className="text-muted">No student has submitted this assignment yet.</p>
      ) : (
        <Card className="shadow-sm rounded-4">
          <Card.Body>
            {/* Search & Filter */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Control
                  placeholder="🔍 Search name or email"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(0);
                  }}
                />
              </Col>
              <Col md={6} className="d-flex justify-content-end">
                <Button variant="success" onClick={exportToExcel}>
                  Export Excel
                </Button>
                {/* <Dropdown className="ms-2">
                  <Dropdown.Toggle variant="secondary">
                    <i className="bx bx-filter-alt"></i> Filter
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setRoleFilter("ADMIN")}>Admin</Dropdown.Item>
                    <Dropdown.Item onClick={() => setRoleFilter("TEACHER")}>Teacher</Dropdown.Item>
                    <Dropdown.Item onClick={() => setRoleFilter("STUDENT")}>Student</Dropdown.Item>
                    <Dropdown.Item onClick={() => setRoleFilter("ALL")}>All</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown> */}
              </Col>
            </Row>

            {/* Table */}
            <Table responsive hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Submitted At</th>
                  <th>File</th>
                  <th>Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.student.id}</td>
                    <td>{sub.student.user.name}</td>
                    <td>{sub.student.user.email}</td>
                    <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                    <td>
                      <Link to={`http://localhost:8080${sub.submittedFile}`} target="_blank" rel="noreferrer">
                        View File
                      </Link>
                    </td>
                    <td style={{ maxWidth: 120 }}>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="Score"
                        value={scoreUpdates[sub.id] ?? sub.score ?? ""}
                        onChange={(e) => handleScoreChange(sub.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <OverlayTrigger overlay={<Tooltip>Save</Tooltip>}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-circle"
                          onClick={() =>
                            updateScore({ submissionId: sub.id, score: scoreUpdates[sub.id] || sub.score })
                          }
                        >
                          <i className="bx bxs-save"></i>
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                  containerClassName="pagination"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  activeClassName="active"
                  previousLabel="«"
                  nextLabel="»"
                  previousClassName="page-item"
                  nextClassName="page-item"
                  previousLinkClassName="page-link"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  forcePage={currentPage}
                />
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
