import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Table, Form, OverlayTrigger, Tooltip, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Courses = () => {
  const navigate = useNavigate();

  // --- Original State ---
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [ecourse, setECourse] = useState({ id: "", title: "", description: "" });

  // --- New State for Search, Filter & Pagination ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8; // You can adjust this number

  // Add new state for subject filter
const [filterSubjectId, setFilterSubjectId] = useState("");

// Update filteredCourses to filter by searchTerm AND subject filter
const filteredCourses = courses.filter((course) => {
  const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesSubject = filterSubjectId ? course.subject.id === parseInt(filterSubjectId) : true;
  return matchesSearch && matchesSubject;
});

// Update resetFilters to also clear subject filter
const resetFilters = () => {
  setSearchTerm("");
  setFilterSubjectId("");
  setCurrentPage(0);
};


  // --- Data Fetching ---
  async function getCourses() {
    try {
      const response = await axios.get(`http://localhost:8080/courses/all`);
      setCourses(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  const getSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:8080/subjects/all");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    getCourses();
    getSubjects();
  }, []);

  // --- CRUD Functions (unchanged) ---
  const handleClose = () => setShow(false);
  const handleShow = () => {
    // Reset form fields when opening modal
    setTitle("");
    setDescription("");
    setSubjectId("");
    setShow(true);
  };

  async function addCourse(new_course) {
    if (!new_course.title || !new_course.description || !new_course.subjectId) {
        alert("Please fill all fields.");
        return;
    }
    await axios.post(`http://localhost:8080/courses/create`, new_course);
    setShow(false);
    getCourses();
  }

  function editCourse(editedcourse) {
    setEditStatus(true);
    setECourse(editedcourse);
  }

  async function updateCourse(updatedCourse) {
    await axios.put(`http://localhost:8080/courses/update/${updatedCourse.id}`, updatedCourse);
    setEditStatus(false);
    setECourse({ id: "", title: "", description: "" });
    getCourses();
  }

  async function deletedCourse(courseId) {
    if (window.confirm("Are you sure you want to delete this course?")) {
        await axios.delete(`http://localhost:8080/courses/${courseId}`);
        getCourses();
    }
  }


  const pageCount = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };



  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredCourses.map(c => ({
        ID: c.id,
        Title: c.title,
        Description: c.description
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'courses.xlsx');
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Courses</h2>
        <Button variant="primary" onClick={handleShow} className="d-flex align-items-center gap-2">
          <i className="bx bx-plus-circle fs-5"></i> Add Course
        </Button>
      </div>

      {/* Add Course Modal (unchanged) */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Course</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Select onChange={(e) => setSubjectId(e.target.value)} value={subjectId}>
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="success" onClick={() => addCourse({ title, description, subjectId: parseInt(subjectId) })}>
              <i className="bx bx-save me-2"></i> Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Table Card */}
      <Card className="shadow-sm rounded-4">
        <Card.Body>
         <Row className="mb-3 align-items-end">
  <Col md={3}>
    <Form.Control
      placeholder="🔍 Search by title"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
      }}
    />
  </Col>
  <Col md={3}>
    <Form.Select
      value={filterSubjectId}
      onChange={(e) => {
        setFilterSubjectId(e.target.value);
        setCurrentPage(0);
      }}
    >
      <option value="">All Subjects</option>
      {subjects.map(subject => (
        <option key={subject.id} value={subject.id}>{subject.name}</option>
      ))}
    </Form.Select>
  </Col>
  <Col md={2}>
    <Button variant="secondary" onClick={resetFilters}>Reset</Button>
  </Col>
  <Col md={4} className="text-end">
    <Button variant="success" onClick={exportToExcel}>Export Excel</Button>
  </Col>
</Row>


          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Subject</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCourses.length > 0 ? (
                paginatedCourses.map((course, index) => (
                  // Your inline-editing logic remains here
                  editStatus && course.id === ecourse.id ? (
                    <tr key={course.id}>
                      <td>{index + 1 + currentPage * itemsPerPage}</td>
                      <td>
                        <Form.Control type="text" value={ecourse.title} onChange={(e) => setECourse({ ...ecourse, title: e.target.value })} />
                      </td>
                      
                      <td>
                        <Form.Control type="text" value={ecourse.description} onChange={(e) => setECourse({ ...ecourse, description: e.target.value })} />
                      </td>
                      <td className="text-end d-flex justify-content-end gap-2">
                        <OverlayTrigger overlay={<Tooltip>Save</Tooltip>}>
                          <Button variant="warning" size="sm" className="rounded-circle" onClick={() => updateCourse(ecourse)}>
                            <i className="bx bx-save"></i>
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ) : (
                    <tr key={course.id}>
                      <td>{index + 1 + currentPage * itemsPerPage}</td>
                      <td>{course.title}</td>
                      <td>{course.subject.name}</td>
                      <td>{course.description}</td>
                      <td className="text-end d-flex justify-content-end gap-2">
                        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                          <Button variant="outline-primary" size="sm" className="rounded-circle" onClick={() => editCourse(course)}>
                            <i className="bx bxs-edit-alt"></i>
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger overlay={<Tooltip>Modules</Tooltip>}>
                          <Button variant="outline-success" size="sm" className="rounded-circle" onClick={() => navigate(`${course.id}/modules`)}>
                            <i className="bx bx-detail"></i>
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                          <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => deletedCourse(course.id)}>
                            <i className="bx bxs-trash"></i>
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  )
                ))
              ) : (
                <tr>
                    <td colSpan="4" className="text-center py-4">No courses found.</td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* --- Pagination Component --- */}
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
    </div>
  );
};

export default Courses;