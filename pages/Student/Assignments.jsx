import React, { useState } from 'react';
import {
  Container, Row, Col, Dropdown, ButtonGroup,
  DropdownButton, Form, Card, Button
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useGetAssignmentsByStudentIdQuery } from '../../features/api/assignementApiSlice';
import ReactPaginate from 'react-paginate';
import { FaClipboardList, FaClock, FaCheckCircle } from 'react-icons/fa';
import dayjs from 'dayjs';
import AssignmentCard from '../../components/AssignmentCard';

function Assignment() {
  const { roleId: studentId } = useSelector(state => state.auth.user);
  const { data: assignments = [], isLoading } = useGetAssignmentsByStudentIdQuery(studentId);

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const filteredAssignments = assignments
    .filter((assignment) => {
      if (filter === "All") return true;
      return assignment.status === filter;
    })
    .filter((assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const pageCount = Math.ceil(filteredAssignments.length / itemsPerPage);
  const paginatedAssignments = filteredAssignments.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  return (
    <Container className="py-5">
    
        <h2 className="fw-bold text-primary mb-0">📝 My Assignments</h2>



      <Row className="my-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="🔍 Search assignments..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0); // reset to page 1
            }}
          />
        </Col>
        <Col>
                <DropdownButton
          as={ButtonGroup}
          id="dropdown-button"
          size="sm"
          variant="outline-success"
          title={`Filter: ${filter}`}
        >
          <Dropdown.Item onClick={() => setFilter("All")}>All</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("Pending")}>Pending</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("Submitted")}>Submitted</Dropdown.Item>
        </DropdownButton></Col>
      </Row>

      {isLoading ? (
        <p>Loading...</p>
      ) : paginatedAssignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        paginatedAssignments.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))
      )}

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
    </Container>
  );
}

export default Assignment;
