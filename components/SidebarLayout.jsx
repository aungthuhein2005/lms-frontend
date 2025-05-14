import React, { useEffect, useState } from 'react';
import { Accordion, Nav, Badge, Form, Button, Offcanvas, CardText } from 'react-bootstrap';
import {
  HouseDoor, Calendar, Envelope, ChatDots, Gear, PersonCircle, List
} from 'react-bootstrap-icons';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import logo from '@/assets/logo.png';
import admin_image from '@/assets/teacher-profile.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveLink } from '../features/ui/uiSlice';

const Sidebar = ({tabs,role}) => {
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setActiveLink(location.pathname));
  }, [location.pathname, dispatch]);

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
          <Offcanvas.Title>EduNext </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Fixed sidebar for desktop */}
      <div className="sidebar-container d-none d-md-flex flex-column">
        <SidebarContent tabs={tabs}  role={role}/>
      </div>
    </>
  );
};

const SidebarContent = ({tabs,role}) => {
  const activeLink = useSelector((state) => state.ui.activeLink);
  
  return (
    <>
      <div className="sidebar-header">
        <img src={logo} alt="EduNext" width="40" />
        <span className="logo-text">EduNext</span>
        <Badge bg="primary" pill className="badge-right">
          <PersonCircle className="icon" />
          <span className='text-capitalize'>{role}</span>
        </Badge>
      </div>

      <Nav className="flex-column px-3 custom-nav mt-2">
        {tabs.map((tab) => (
          <Nav.Link
            as={Link} 
            to={tab.path}
            key={tab.name}
            className="custom-nav-link"
            active={activeLink === tab.path}
          >
            {tab.icon}
            <span className="ms-2">{tab.name}</span>
          </Nav.Link>
        ))}
        
        <Nav.Link href="#" className="custom-nav-link" active={activeLink === '#'}>
          <Envelope className="icon" />
          Mail <Badge bg="primary" pill className="badge-right">10+</Badge>
        </Nav.Link>
        <Nav.Link href="#" className="custom-nav-link" active={activeLink === '#'}>
          <ChatDots className="icon" />
          Chat <Badge bg="primary" pill className="badge-right">2+</Badge>
        </Nav.Link>
      </Nav>

      {/* <div className="sidebar-footer mt-auto p-3">
        <div className="d-flex align-items-center user-profile">
          <img
            src={admin_image}
            alt="User"
            width={50}
            height={50}
            className="user-icon border rounded-circle object-fit-cover"
          />
          <div>
            <div className="fw-bold">Tharindu Damsara</div>
            <small>eg22334@eng.ruh.ac.lk</small>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Sidebar;
