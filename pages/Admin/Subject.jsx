import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Button, Modal, Form, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ReactPaginate from 'react-paginate';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [eSubject, setESubject] = useState({ id: "", name: "", description: "" });

  // Filter and Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    getSubjects();
  }, []);

  const getSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:8080/subjects/all");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const addSubject = async (newSubject) => {
    try {
      await axios.post("http://localhost:8080/subjects", newSubject);
      setShow(false);
      setName("");
      setDescription("");
      getSubjects();
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const editSubject = (subject) => {
    setEditStatus(true);
    setESubject(subject);
  };

  const updateSubject = async (updatedSubject) => {
    try {
      await axios.put(`http://localhost:8080/subjects/${updatedSubject.id}`, updatedSubject);
      setEditStatus(false);
      setESubject({ id: "", name: "", description: "" });
      getSubjects();
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  const deleteSubject = async (subjectId) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await axios.delete(`http://localhost:8080/subjects/${subjectId}`);
        getSubjects();
      } catch (error) {
        console.error("Error deleting subject:", error);
      }
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCurrentPage(0);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredSubjects.map(s => ({ ID: s.id, Name: s.name, Description: s.description }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subjects");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'subjects.xlsx');
  };

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredSubjects.length / itemsPerPage);
  const paginatedSubjects = filteredSubjects.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2  className="fw-bold text-primary">Subjects</h2>
        <Button variant="primary" onClick={() => setShow(true)}>
          <i className="bx bx-message-square-add me-2"></i> Add Subject
        </Button>
      </div>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Control type="text" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="success" onClick={() => addSubject({ name, description })}>
            <i className="bx bx-save me-1"></i> Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Subject Table */}
      <Card className="shadow-sm rounded-4">
        <Card.Body>
                <Row className="mb-3 align-items-end">
        <Col md={4}>
          <Form.Control
            placeholder="🔍 Search by name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
          />
        </Col>
        <Col md={2}>
          <Button variant="secondary" onClick={resetFilters}>Reset</Button>
        </Col>
        <Col md={{ span: 2, offset: 4 }} className="text-end">
          <Button variant="success" onClick={exportToExcel}>Export Excel</Button>
        </Col>
      </Row>
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubjects.length > 0 ? (
                paginatedSubjects.map((subject) =>
                  editStatus && subject.id === eSubject.id ? (
                    <tr key={subject.id}>
                      <td>{subject.id}</td>
                      <td>
                        <Form.Control value={eSubject.name} onChange={(e) => setESubject({ ...eSubject, name: e.target.value })} />
                      </td>
                      <td>
                        <Form.Control value={eSubject.description} onChange={(e) => setESubject({ ...eSubject, description: e.target.value })} />
                      </td>
                      <td className="text-end d-flex justify-content-end gap-2">
                        <OverlayTrigger overlay={<Tooltip>Save</Tooltip>}>
                          <Button variant="warning" size="sm" className="rounded-circle" onClick={() => updateSubject(eSubject)}>
                            <i className="bx bx-save"></i>
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ) : (
                    <tr key={subject.id}>
                      <td>{subject.id}</td>
                      <td>{subject.name}</td>
                      <td>{subject.description}</td>
                      <td className="text-end d-flex justify-content-end gap-2">
                        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                          <Button variant="outline-primary" size="sm" className="rounded-circle" onClick={() => editSubject(subject)}>
                            <i className="bx bxs-edit-alt"></i>
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                          <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => deleteSubject(subject.id)}>
                            <i className="bx bxs-trash"></i>
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr><td colSpan="4" className="text-center py-4">No subjects found.</td></tr>
              )}
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
    </div>
  );
};

export default Subjects;
