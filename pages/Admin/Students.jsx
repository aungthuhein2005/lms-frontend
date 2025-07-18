import React, { useEffect, useState } from 'react';
import { Button,Badge, Table, Form, Card, OverlayTrigger, Tooltip, InputGroup, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import AssignModal from '../../components/AssignModal';
import AddStudentModal from '../../components/AddStudentModal';
import { useDispatch } from 'react-redux';
import { setOpenModal } from '../../features/ui/uiSlice';
import { useAssignToClassMutation, useGetStudentsQuery, useRestoreStudentMutation, useSoftDeleteStudentMutation } from '../../features/api/studentApiSlice';
import { useGetClassesQuery } from '../../features/api/classApiSlice';
import DateHelper from '../../helpers/DateHelper';
import EditStudentModal from '../../components/EditStudentModal';
import { confirm } from '../../helpers/confirm';
import { showAlert } from '../../features/ui/alertSlice';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function Students() {
  const dispatch = useDispatch();
  const { data: students = [], isLoading, error, refetch } = useGetStudentsQuery();
  const { data: classes } = useGetClassesQuery();
  const [softDeleteStudent] = useSoftDeleteStudentMutation();
  const [restoreStudent] = useRestoreStudentMutation();
  const [assignToClass] = useAssignToClassMutation();

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [enrollDate, setEnrollDate] = useState(DateHelper.formatYMD(new Date()));

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);


const filteredStudents = students
  .filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.id.toString().includes(searchTerm)
  )
  .filter(student => {
    if (!fromDate && !toDate) return true;
    const enroll = new Date(student.enrollDate);
    if (fromDate && enroll < new Date(fromDate)) return false;
    if (toDate && enroll > new Date(toDate)) return false;
    return true;
  });
const paginatedStudents = filteredStudents.slice(
  currentPage * pageSize,
  (currentPage + 1) * pageSize
);

  const pageCount = Math.ceil(filteredStudents.length / pageSize);

const handlePageChange = ({ selected }) => {
  setCurrentPage(selected);
};

  // Reset filters handler
  const resetFilters = () => {
    setSearchTerm('');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  const handleSoftDelete = async (id) => {
    const result = await confirm('Are you sure? You want to delete this student');
    if (result) {
      try {
        await softDeleteStudent(id).unwrap();
        dispatch(showAlert({
          show: true,
          title: "Success",
          type: "success",
          message: "Student deleted successfully.",
        }));
        refetch();
      } catch (error) {
        dispatch(showAlert({
          show: true,
          title: "Error",
          type: "danger",
          message: "Failed to delete student.",
        }));
      }
    }
  };

    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredStudents.map((s) => ({
          Name: s.name,
          HireDate: DateHelper.formatYMD(s.enrollDate),
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(dataBlob, 'teachers.xlsx');
    };
  

  const handleRestore = async (id) => {
    const result = confirm('Are you sure? You want to restore this student');
    if (result) {
      try {
        await restoreStudent(id).unwrap();
        dispatch(showAlert({
          show: true,
          title: "Success",
          type: "success",
          message: "Student restored successfully.",
        }));
        refetch();
      } catch (error) {
        dispatch(showAlert({
          show: true,
          title: "Error",
          type: "danger",
          message: "Failed to restore student.",
        }));
      }
    }
  };

  const handleAssignToClass = async (e) => {
    e.preventDefault();

    if (!selectedStudentId || !selectedClass) {
      dispatch(showAlert({
        show: true,
        title: "Warning",
        type: "warning",
        message: "Please select a student and a class.",
      }));
      return;
    }
    
    try {
      await assignToClass({ studentId: selectedStudentId, classId: selectedClass, enrolled_at: enrollDate }).unwrap();
      dispatch(showAlert({
        show: true,
        title: "Success",
        type: "success",
        message: "Student assigned to class successfully.",
      }));
      dispatch(setOpenModal(false));
      setSelectedStudentId('');
      setSelectedClass('');
      setEnrollDate(DateHelper.formatYMD(new Date()));
      refetch();
    } catch (error) {
      dispatch(showAlert({
        show: true,
        title: "Error",
        type: "danger",
        message: "Failed to assign student to class.",
      }));
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="container py-5">
      {/* Edit Modal */}
      <EditStudentModal
        show={editModalOpen}
        handleClose={() => {
          setEditModalOpen(false);
          setEditingStudent(null);
          refetch();
        }}
        student={editingStudent}
      />

      {/* Assign Modal */}
      <AssignModal>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicClass">
            <Form.Label>Class</Form.Label>
            <Form.Select
              aria-label="Select class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(Number(e.target.value))}
            >
              <option>Select class to assign</option>
              {classes?.map((clas) => (
                <option key={clas.id} value={clas.id}>
                  {clas.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEnrollDate">
            <Form.Label>Enrolled At</Form.Label>
            <Form.Control
              type="date"
              value={enrollDate}
              onChange={(e) => setEnrollDate(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleAssignToClass}>
            Assign
          </Button>
        </Form>
      </AssignModal>

      {/* Header with Filters */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold text-primary">Students</h2>
        </div>
        <AddStudentModal />
      </div>


      {/* Table Card */}
      <Card className="shadow-sm rounded-4">
        <Card.Body>
                    <Row className="mb-3 align-items-end">
                      <Col md={4}>
                        <Form.Control
                          placeholder="🔍 Search by name"
                          value={searchTerm}
                          className='w-50'
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
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Enroll Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4">No student found.</td></tr>
              ) : 
              (paginatedStudents.map((student) => (
                <tr
                  key={student.id}
                  className={student.deleted ? 'table-danger text-muted' : ''}
                >
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{DateHelper.formatYMD(student.enrollDate)}</td>
                  <td className="text-end d-flex justify-content-end gap-2">
                    {!student.deleted && (
                      <>
                        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="rounded-circle"
                            onClick={() => {
                              setEditingStudent(student);
                              setEditModalOpen(true);
                            }}
                          >
                            <i className="bx bxs-edit"></i>
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger overlay={<Tooltip>Assign to Class</Tooltip>}>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="rounded-circle"
                            onClick={() => {
                              dispatch(setOpenModal(true));
                              setSelectedStudentId(student.id);
                            }}
                          >
                            <i className="bx bx-plus-circle"></i>
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger overlay={<Tooltip>View Details</Tooltip>}>
                          <Link to={`${student.id}`}>
                            <Button variant="outline-success" size="sm" className="rounded-circle">
                              <i className="bx bxs-detail"></i>
                            </Button>
                          </Link>
                        </OverlayTrigger>
                      </>
                    )}

                    {student.deleted ? (
                      <OverlayTrigger overlay={<Tooltip>Restore</Tooltip>}>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => handleRestore(student.id)}
                        >
                          <i className="bx bx-rotate-right"></i>
                        </Button>
                      </OverlayTrigger>
                    ) : (
                      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => handleSoftDelete(student.id)}
                        >
                          <i className="bx bxs-trash"></i>
                        </Button>
                      </OverlayTrigger>
                    )}
                  </td>
                </tr>
              )))}

              
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
