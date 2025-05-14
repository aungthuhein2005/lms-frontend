import React from 'react';
import { Container, Card, Button, Row, Col, Badge, Dropdown, DropdownDivider } from 'react-bootstrap';
import AssignmentCard from '../../components/AssignmentCard';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';

const assignments = [
  {
    id: 1,
    title: 'Essay on World War II',
    subject: 'History',
    dueDate: '2025-05-15',
    status: 'Pending',
    description: 'Write a 500-word essay on key causes of World War II.',
  },
  {
    id: 2,
    title: 'Algebra Worksheet',
    subject: 'Math',
    dueDate: '2025-05-13',
    status: 'Submitted',
    description: 'Complete and submit the algebra worksheet.',
  },
   {
    id: 3,
    title: 'Algebra Worksheet',
    subject: 'Math',
    dueDate: '2025-05-13',
    status: 'Submitted',
    description: 'Complete and submit the algebra worksheet.',
  }
];

function Assignment() {
  return (
    <Container className="">
      <div className='d-flex justify-content-between align-items-center'>
          
      <h2 className="mb-4">My Assignments</h2>
      <div>
        <DropdownButton
  as={ButtonGroup}
  id="dropdown-button"
  size="sm"
  variant="success"
  title="Filter by"
>

          <Dropdown.Item eventKey="1">Pending</Dropdown.Item>
          <Dropdown.Divider/>
          <Dropdown.Item eventKey="2">Complete</Dropdown.Item>
          
          
        </DropdownButton>
      </div>
      </div>
      <Row className='gap-3 mt-4'>
        {assignments.map((assignment) => (
          
            <AssignmentCard assignment={assignment}/>
        ))}
      </Row>
    </Container>
  );
}

export default Assignment;
