import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button, Card, Modal, Form, Row, Col, InputGroup
} from "react-bootstrap";
import { useGetClassByTeacherIdQuery } from "../../features/api/classApiSlice";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";

export default function TeacherAssignmentPage() {
  const { roleId } = useSelector((state) => state.auth.user);
  const { data: teacherClasses = [] } = useGetClassByTeacherIdQuery(roleId);

  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    media: "",
    point: 10,
    classId: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const fetchAssignments = async () => {
    const res = await axios.get(`http://localhost:8080/assignments/teacher/${roleId}`);
    setAssignments(res.data);
  };

  useEffect(() => {
    if (roleId) fetchAssignments();
  }, [roleId]);

  const handleCreate = async () => {
    await axios.post(`http://localhost:8080/assignments/create`, {
      ...formData,
      classId: parseInt(formData.classId),
      teacherId: roleId,
    });
    fetchAssignments();
    setShowModal(false);
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      media: "",
      point: 10,
      classId: "",
    });
  };

  const filteredAssignments = assignments
    .filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.classEntity?.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(a => {
      if (!filterClass) return true;
      return a.classEntity?.id.toString() === filterClass;
    })
    .filter(a => {
      const due = new Date(a.dueDate);
      if (fromDate && due < new Date(fromDate)) return false;
      if (toDate && due > new Date(toDate)) return false;
      return true;
    });

  const pageCount = Math.ceil(filteredAssignments.length / itemsPerPage);
  const paginatedAssignments = filteredAssignments.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  const resetFilters = () => {
    setSearchTerm("");
    setFilterClass("");
    setFromDate("");
    setToDate("");
    setCurrentPage(0);
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Assignments</h2>
        <Button onClick={() => setShowModal(true)} variant="primary">
          <i className="bx bx-plus me-2"></i> Create Assignment
        </Button>
      </div>

      {/* Filters */}
      <Row className="g-2 mb-4">
        <Col md={4}>
          <Form.Control
            placeholder="🔍 Search by title or class"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
          />
        </Col>
        <Col md={2}>
          <Form.Select
            value={filterClass}
            onChange={(e) => {
              setFilterClass(e.target.value);
              setCurrentPage(0);
            }}
          >
            <option value="">All Classes</option>
            {teacherClasses.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" onClick={resetFilters}>
            Reset
          </Button>
        </Col>
      </Row>

      {/* Assignment Cards */}
      {paginatedAssignments.length > 0 ? (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {paginatedAssignments.map((a) => (
              <Col key={a.id}>
                <Card className="shadow-sm h-100 ">
                  <Card.Body>
                    <Card.Title className="fw-semibold">{a.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Class: {a.classEntity?.name || "N/A"}
                    </Card.Subtitle>
                    <Card.Text className="small text-secondary">
                      {a.description || "No description"}
                    </Card.Text>
                    <div className="d-flex flex-column gap-1 mt-2">
                      <div>
                        <strong>Due:</strong> {format(new Date(a.dueDate), "yyyy-MM-dd")}
                      </div>
                      <div>
                        <strong>Points:</strong> {a.point}
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white text-end">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      href={`/teacher/assignments/${a.id}/submissions`}
                    >
                      View Submissions
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>

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
              forcePage={currentPage}
            />
          </div>)}
        </>
      ) : (
        <div className="text-center text-muted mt-5">
          <p>No assignments found.</p>
        </div>
      )}

      {/* Create Assignment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">📝 Create Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Media URL</Form.Label>
              <Form.Control
                value={formData.media}
                onChange={(e) => setFormData({ ...formData, media: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                value={formData.point}
                onChange={(e) => setFormData({ ...formData, point: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assign to Class</Form.Label>
              <Form.Select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              >
                <option value="">Choose Class</option>
                {teacherClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer className="px-4 pb-3">
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            ❌ Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            ✅ Save Assignment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
