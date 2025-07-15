import React, { useState } from 'react';
import { Accordion, Button, ProgressBar, Card, Row, Col, Form, InputGroup, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProgreassGrading() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const classes = [
    { id: 1, name: 'Math 101' },
    { id: 2, name: 'Science 101' },
  ];

  const students = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', grades: { 1: 85, 2: 90 } },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', grades: { 1: 75, 2: 88 } },
    { id: 3, name: 'Bob Brown', email: 'bob.brown@example.com', grades: { 1: 65, 2: 80 } },
    { id: 4, name: 'Alice White', email: 'alice.white@example.com', grades: { 1: 95, 2: 89 } },
    { id: 5, name: 'Tom Green', email: 'tom.green@example.com', grades: { 1: 70, 2: 84 } },
    { id: 6, name: 'Chris Blue', email: 'chris.blue@example.com', grades: { 1: 60, 2: 77 } },
  ];

  // Search + filter students
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">📊 Grading & Progress</h3>

      {/* Search Box */}
      <InputGroup className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
        <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
          Clear
        </Button>
      </InputGroup>

      {/* Class Accordions */}
      {classes.map((clas) => (
        <Accordion key={clas.id} className="mb-3 shadow-sm rounded-3" defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <span className="fw-semibold">{clas.name}</span>
            </Accordion.Header>
            <Accordion.Body>
              {currentStudents.map((student) => {
                const grade = student.grades[clas.id] || 0;
                return (
                  <Card key={`${student.id}-${clas.id}`} className="mb-3 border-0 bg-light shadow-sm rounded-4 p-3">
                    <Row className="align-items-center">
                      <Col md={6}>
                        <h6 className="mb-1 fw-bold">{student.name}</h6>
                        <ProgressBar now={grade} label={`${grade}%`} />
                      </Col>
                      <Col md={6} className="text-end">
                        <Link to={`/teacher/grades/student/${student.id}`} className="btn btn-outline-secondary ms-2">
                          <i className="bx bx-file me-2"></i> View Submissions
                        </Link>
                      </Col>
                    </Row>
                  </Card>
                );
              })}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Pagination className="mt-3 justify-content-center">
                  {[...Array(totalPages).keys()].map((num) => (
                    <Pagination.Item
                      key={num + 1}
                      active={currentPage === num + 1}
                      onClick={() => handlePageChange(num + 1)}
                    >
                      {num + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        
      ))}
    <Pagination className="mt-3 justify-content-center">
                  {[...Array(totalPages).keys()].map((num) => (
                    <Pagination.Item
                      key={num + 1}
                      active={currentPage === num + 1}
                      onClick={() => handlePageChange(num + 1)}
                    >
                      {num + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
    </div>
  );
}
