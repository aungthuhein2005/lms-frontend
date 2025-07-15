import React, { useEffect, useState } from 'react';
import {
  Container, Row, Dropdown, ButtonGroup,
  DropdownButton
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import AssignmentCard from '../../components/AssignmentCard';
import { useGetAssignmentsByStudentIdQuery } from '../../features/api/assignementApiSlice';

function Assignment() {
  const { roleId: studentId } = useSelector(state => state.auth.user);
  const { data: assignments, isLoading } = useGetAssignmentsByStudentIdQuery(studentId);

  const [filter, setFilter] = useState("All");

  const filteredAssignments = assignments?.filter((assignment) => {
    if (filter === "All") return true;
    return assignment.status === filter;
  });

  return (
    <Container>
      <div className='d-flex justify-content-between align-items-center'>
        <h2 className="mb-4">My Assignments</h2>
        <DropdownButton
          as={ButtonGroup}
          id="dropdown-button"
          size="sm"
          variant="success"
          title={`Filter: ${filter}`}
        >
          <Dropdown.Item onClick={() => setFilter("All")}>All</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("Pending")}>Pending</Dropdown.Item>
          <Dropdown.Item onClick={() => setFilter("Submitted")}>Submitted</Dropdown.Item>
        </DropdownButton>
      </div>

      <Row className='gap-3 mt-4'>
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredAssignments?.length === 0 ? (
          <p>No assignments found.</p>
        ) : (
          filteredAssignments.map((assignment) => (
            <div key={assignment.id}>
              <AssignmentCard assignment={assignment} />
            </div>
          ))
        )}
      </Row>
    </Container>
  );
}

export default Assignment;
