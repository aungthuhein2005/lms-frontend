import React,{useEffect,useState} from 'react';
import { Button, Table, Form, Card, OverlayTrigger, Tooltip, Row, Col } from "react-bootstrap";
import { useAssignToClassMutation, useDeleteTeacherMutation, useGetTeachersQuery, useHireteacherMutation, useUpdateTeacherMutation } from '../../features/api/teacherApiSlice';
import DateHelper from '../../helpers/DateHelper';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../features/ui/alertSlice';
import { Link } from 'react-router-dom';
import AssignModal from '../../components/AssignModal';
import { useGetClassesQuery } from '../../features/api/classApiSlice';
import { setOpenModal } from '../../features/ui/uiSlice';
import TeacherEditModal from '../../components/TeacherEditModal';
import AddTeacherModal from '../../components/AddTeacherModal';
import ReactPaginate from 'react-paginate';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function Teachers() {
  const dispatch = useDispatch();

  const { data = [], isLoading, error, refetch } = useGetTeachersQuery();
  const { data: classes } = useGetClassesQuery();
  const [deleteTeacher] = useDeleteTeacherMutation();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [hireTeacher] = useHireteacherMutation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignToClass] = useAssignToClassMutation();

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const filteredTeachers = data.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFrom = fromDate ? new Date(teacher.hireDate) >= new Date(fromDate) : true;
    const matchesTo = toDate ? new Date(teacher.hireDate) <= new Date(toDate) : true;
    return matchesSearch && matchesFrom && matchesTo;
  });

  const pageCount = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTeachers.map((t) => ({
        Name: t.name,
        HireDate: DateHelper.formatYMD(t.hireDate),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Teachers");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'teachers.xlsx');
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setCurrentPage(0);
  };

  const handleAssignToClass = async (e) => {
    e.preventDefault();

    if (!selectedTeacherId || !selectedClass) {
      dispatch(showAlert({ show: true, message: "Please select a teacher and a class.", title: "Warning", type: "warning" }));
      return;
    }

    try {
      const assigned_at = new Date().toISOString();
      await assignToClass({ teacherId: selectedTeacherId, classId: selectedClass, assigned_at }).unwrap();

      dispatch(showAlert({ show: true, message: 'Teacher assigned to class successfully.', title: 'Success', type: 'success' }));
      setSelectedTeacherId("");
      setSelectedClass("");
      dispatch(setOpenModal(false));
    } catch (error) {
      console.error("Assign error:", error);
      dispatch(showAlert({ show: true, message: 'Failed to assign teacher to class.', title: 'Error', type: 'danger' }));
    }
  };

  const handleUpdateTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  const handleDeleteTeacher = async (id) => {
    const result = window.confirm('Are you sure you want to delete this teacher?');
    if (result) {
      try {
        await deleteTeacher(id).unwrap();
        dispatch(showAlert({ show: true, message: 'Teacher deleted successfully', title: 'Success', type: 'success' }))
      } catch (error) {
        console.error('Failed to delete teacher:', error);
        dispatch(showAlert({ show: true, message: 'Failed to delete teacher', title: 'Error', type: 'danger' }))
      }
    }
  };

  const submitUpdateTeacher = async (updatedTeacher) => {
    try {
      await hireTeacher(updatedTeacher).unwrap();
      refetch();
      dispatch(showAlert({ show: true, message: 'Teacher updated successfully', title: 'Success', type: 'success' }));
      setShowEditModal(false);
    } catch (error) {
      console.error("Update error:", error);
      dispatch(showAlert({ show: true, message: 'Failed to update teacher', title: 'Error', type: 'danger' }));
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container py-5">
      <TeacherEditModal show={showEditModal} onHide={() => setShowEditModal(false)} teacher={selectedTeacher} onSubmit={submitUpdateTeacher} />
      <AddTeacherModal show={showAddModal} handleClose={() => setShowAddModal(false)} />

      <AssignModal>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicClass">
            <Form.Label>Select Class</Form.Label>
            <Form.Select value={selectedClass} onChange={(e) => setSelectedClass(Number(e.target.value))}>
              <option>Select class to assign</option>
              {classes?.map((clas) => (
                <option key={clas.id} value={clas.id}>{clas.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" onClick={handleAssignToClass}>Assign</Button>
        </Form>
      </AssignModal>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2  className="fw-bold text-primary">Teachers</h2>
        <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowAddModal(true)}>
          <i className="bx bx-plus-circle fs-5"></i> Add Teacher
        </Button>
      </div>

      <Card className="rounded-4">
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
              <Form.Label>From</Form.Label>
              <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </Col>
            <Col md={2}>
              <Form.Label>To</Form.Label>
              <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </Col>
            <Col md={1} className="text-end">
              <Button variant="secondary" onClick={resetFilters}>Reset</Button>
            </Col>
            <Col md={3} className="text-end">
              <Button variant="success" onClick={exportToExcel}>Export Excel</Button>
            </Col>
          </Row>

          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Hire Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTeachers.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4">No teachers found.</td></tr>
              ) : (
                paginatedTeachers.map((teacher, index) => (
                  <tr key={teacher.id}>
                    <td>{index + 1 + currentPage * itemsPerPage}</td>
                    <td>{teacher.name}</td>
                    <td>{DateHelper.formatYMD(teacher.hireDate)}</td>
                    <td className="text-end d-flex justify-content-end gap-2">
                      <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                        <Button variant="outline-primary" size="sm" className="rounded-circle" onClick={() => handleUpdateTeacher(teacher)}>
                          <i className="bx bxs-edit"></i>
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Assign to Class</Tooltip>}>
                        <Button variant="outline-warning" size="sm" className="rounded-circle" onClick={() => {
                          dispatch(setOpenModal(true));
                          setSelectedTeacherId(teacher.id);
                        }}>
                          <i className="bx bx-plus-circle"></i>
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Details</Tooltip>}>
                        <Link to={`/admin/teachers/${teacher.id}`}>
                          <Button variant="outline-success" size="sm" className="rounded-circle">
                            <i className="bx bxs-detail"></i>
                          </Button>
                        </Link>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                        <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => handleDeleteTeacher(teacher.id)}>
                          <i className="bx bxs-trash-alt"></i>
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

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
        </Card.Body>
      </Card>
    </div>
  );
}