import React, { useState } from 'react';
import { Accordion, Nav, Badge, Form, Button, Offcanvas, CardText } from 'react-bootstrap';
import {
  HouseDoor, Calendar, Envelope, ChatDots, Gear, PersonCircle, List
} from 'react-bootstrap-icons';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import admin_image from '@/assets/teacher-profile.jpg'

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const toggleSidebar = () => setShow(!show);

  return (
    <>
      {/* Top nav toggle for small screens */}
      <div className="d-md-none bg-white p-2 shadow-sm">
        <Button variant="light" onClick={toggleSidebar}>
          <List size={24} />
        </Button>
      </div>

      {/* Offcanvas sidebar for mobile */}
      <Offcanvas show={show} onHide={toggleSidebar} className="d-md-none" backdrop>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>EduNext</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Fixed sidebar for desktop */}
      <div className="sidebar-container d-none d-md-flex flex-column">
        <SidebarContent />
      </div>
    </>
  );
};

const SidebarContent = () => (
  <>
    <div className="sidebar-header">
      <img src={logo} alt="EduNext" width="40" />
      <span className="logo-text">EduNext</span>
    </div>

    <Nav className="flex-column px-3 custom-nav mt-2">
      <Nav.Link as={Link} to={'/'}><i className='bx bxs-dashboard me-2' style={{fontSize:20}}></i>Dashboard</Nav.Link>
      <Nav.Link as={Link} to={'/users'}><i className='bx bxs-group me-2' style={{fontSize:20}}></i>Users</Nav.Link>

      {/* <Accordion flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>My Courses</Accordion.Header>
          <Accordion.Body>
            <Nav.Link href="#">Enrolled Courses</Nav.Link>
            <Nav.Link href="#">Bookmarked Courses</Nav.Link>
            <Nav.Link href="#">Completed Courses</Nav.Link>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion> */}

      <Nav.Link as={Link} to={'/teachers'}><i className='bx bxs-book-reader me-2' style={{fontSize:20}}></i>Teachers</Nav.Link> 

      {/* <Accordion flush>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Assessments</Accordion.Header>
          <Accordion.Body>
            <Nav.Link href="#">Quizzes</Nav.Link>
            <Nav.Link href="#">Assignments</Nav.Link>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion> */}
<Nav.Link as={Link} to={'/courses'}><i className='bx bxs-book-alt me-2' style={{fontSize:20}}></i>Courses</Nav.Link> 
<Nav.Link as={Link} to={'/students'}><i className='bx bx-male-female me-2' style={{fontSize:20}}></i>Students</Nav.Link> 
<Nav.Link as={Link} to={'/classes'}><i className='bx bxs-directions me-2' style={{fontSize:20}}></i>Classes</Nav.Link> 
<Nav.Link as={Link} to={'/teacher_attendance'}><i className='bx bxs-select-multiple me-2' style={{fontSize:20}}></i>Teacher's Attendance</Nav.Link> 
<Nav.Link as={Link} to={'/report'}><i className='bx bxs-report me-2' style={{fontSize:20}}></i>Report</Nav.Link> 
      <Nav.Link href="#">
        <Envelope className="icon" />
        Mail <Badge bg="primary" pill className="badge-right">10+</Badge>
      </Nav.Link>

      {/* <Accordion flush>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Progress</Accordion.Header>
          <Accordion.Body>
            <Nav.Link href="#">Course Progress</Nav.Link>
            <Nav.Link href="#">Scores</Nav.Link>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion> */}

      <Nav.Link href="#">
        <ChatDots className="icon" />
        Chat <Badge bg="primary" pill className="badge-right">2+</Badge>
      </Nav.Link>

      {/* <Accordion flush>
        <Accordion.Item eventKey="3">
          <Accordion.Header>Resources</Accordion.Header>
          <Accordion.Body>
            <Nav.Link href="#">Documents</Nav.Link>
            <Nav.Link href="#">Videos</Nav.Link>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion flush>
        <Accordion.Item eventKey="4">
          <Accordion.Header>Community</Accordion.Header>
          <Accordion.Body>
            <Nav.Link href="#">Forums</Nav.Link>
            <Nav.Link href="#">Events</Nav.Link>
            <Badge bg="primary" pill className="badge-right">15+</Badge>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion flush>
        <Accordion.Item eventKey="5">
          <Accordion.Header><Gear className="icon" />Settings</Accordion.Header>
          <Accordion.Body>
            <Nav.Link href="#">Preferences</Nav.Link>
            <Nav.Link href="#">Account</Nav.Link>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion> */}
    </Nav>

    <div className="sidebar-footer mt-auto p-3">
      
      <div className="d-flex align-items-center user-profile">
        <img src={admin_image} alt="User" width={50} height={50} className="user-icon border rounded-circle object-fit-cover"/>
        <div>
          <div className="fw-bold">Tharindu Damsara</div>
          <small>eg22334@eng.ruh.ac.lk</small>
        </div>
      </div>
    </div>
  </>
);

export default Sidebar;
