import React, { useState } from 'react';
import { Table, Button, Form, Accordion, OverlayTrigger, Tooltip, Spinner, Card, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../features/ui/alertSlice';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// --- IMPORTANT: Removed useGetTeachersQuery if this component is only for students ---
// import { useGetTeachersQuery } from '../../features/api/teacherApiSlice'; // <--- REMOVED

import { // Ensure these are imported from the correct slice if separate for students/teachers
  useGetAttendancesByTypeQuery,
  useAddAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} from '../../features/api/attendanceApiSlice'; // Assuming attendanceApiSlice handles both student/teacher attendances
import { useGetStudentsQuery } from '../../features/api/studentApiSlice'; // <--- KEPT for fetching students

// Helper function to group data by date
const groupByDate = (data) => {
  if (!data) return {};
  return data.reduce((groups, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
};

const AttendanceList = () => {
  const [editStatus, setEditStatus] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();

  // RTK Query hooks for fetching data
  // Now fetching students data instead of teachers
  const { data: students, isLoading: isLoadingStudents, isError: isErrorStudents } = useGetStudentsQuery();
  console.log(students);
  
  
  // Fetch attendances specifically for STUDENT type
  // Make sure 'STUDENT' matches your Java enum constant (e.g., public enum Type { STUDENT, TEACHER } )
  const { data: attendances, isLoading: isLoadingAttendances, isError: isErrorAttendances } = useGetAttendancesByTypeQuery('STUDENT_ATTENDANCE'); // Changed to 'STUDENT'

  
  // RTK Query hooks for mutations
  const [addAttendanceMutation] = useAddAttendanceMutation();
  const [updateAttendanceMutation] = useUpdateAttendanceMutation();
  const [deleteAttendanceMutation] = useDeleteAttendanceMutation();

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);

  // Filtered and Paginated Attendances
  const filteredAttendances = attendances
    ? attendances.filter(attendance => {
        // Filter by search term (student name or attendance ID)
       
        const matchesSearchTerm =
          (attendance.student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          attendance.id.toString().includes(searchTerm);

        // Filter by date range
        const attendanceDate = new Date(attendance.date);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        const matchesDateRange =
          (!from || attendanceDate >= from) &&
          (!to || attendanceDate <= to);

        return matchesSearchTerm && matchesDateRange;
      })
    : [];

  // Calculate total pages for pagination
  const pageCount = Math.ceil(filteredAttendances.length / pageSize);

  // Get attendances for the current page
  const paginatedAndFilteredAttendances = filteredAttendances.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // Group paginated and filtered attendances by date for display
  const groupedPaginated = groupByDate(paginatedAndFilteredAttendances);

  // --- State for editing an attendance record ---
  const [eAttendance, setEAttendance] = useState({
    id: '',
    date: '',
    // Changed from teacherId to studentId
    studentId: '', // Use studentId instead of teacherId
    status: '',
    remark: '',
    type: 'STUDENT_ATTENDANCE', // Ensure type matches the fetched type
  });

  // --- State for new attendance form ---
  const [formData, setFormData] = useState({
    date: '',
    studentId: '',
    status: 'attempt',
    remark: '',
    type: 'STUDENT_ATTENDANCE', // Ensure type matches what you're adding
  });

  const handleAddAttendance = async (newAttendance) => {
    try {
      await addAttendanceMutation(newAttendance).unwrap();
      dispatch(showAlert({ show: true, message: "Add Success", title: "Success", type: "success" }));
      // Reset form data for student
      setFormData({ date: '', studentId: '', status: 'attempt', remark: '', type: 'STUDENT_ATTENDANCE' });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add attendance:", error);
      dispatch(showAlert({ show: true, message: "Add Fail", title: "Fail", type: "danger" }));
    }
  };

  const handleEditAttendance = (attendance) => {
    setEditStatus(true);
    // Ensure you're setting the studentId for editing
    setEAttendance({
      ...attendance,
      studentId: attendance.student?.id || '', // Populate studentId if available
      // Make sure 'type' is also set correctly from the existing attendance
      type: attendance.type || 'STUDENT'
    });
  };

  const handleUpdateAttendance = async (updatedAttendance) => {
    try {
      await updateAttendanceMutation(updatedAttendance).unwrap();
      dispatch(showAlert({ show: true, message: "Update Success", title: "Success", type: "success" }));
      Swal.fire({
        icon: 'success',
        title: 'Update Success',
        text: 'Attendance has been updated.',
        timer: 1000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Failed to update attendance:", error);
      dispatch(showAlert({ show: true, message: "Update Fail", title: "Fail", type: "danger" }));
      Swal.fire({
        icon: 'error',
        title: 'Update Fail',
        text: 'Failed to update attendance.',
        timer: 1000,
        showConfirmButton: false
      });
    } finally {
      setEditStatus(false);
      // Reset editing state for student
      setEAttendance({ id: '', date: '', studentId: '', status: '', remark: '', type: 'STUDENT_ATTENDANCE' });
    }
  };

  const handleDeleteAttendance = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This attendance record will be deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAttendanceMutation(id).unwrap();
          dispatch(showAlert({ show: true, message: "Delete Success", title: "Success", type: "success" }));
          Swal.fire('Deleted!', 'Attendance record has been deleted.', 'success');
        } catch (error) {
          console.error("Failed to delete attendance:", error);
          dispatch(showAlert({ show: true, message: "Delete Fail", title: "Fail", type: "danger" }));
          Swal.fire('Error!', 'Failed to delete attendance.', 'error');
        }
      }
    });
  };

  const handleEditChange = (e) => {
    // If the changed field is 'studentId', convert it to integer
    const value = e.target.name === 'studentId' ? parseInt(e.target.value, 10) : e.target.value;
    setEAttendance({ ...eAttendance, [e.target.name]: value });
  };


  const handleFormChange = (e) => {
    // If the changed field is 'studentId', convert it to integer
    const value = e.target.name === 'studentId' ? parseInt(e.target.value, 10) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };


  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFromDate('');
    setToDate('');
    setCurrentPage(0);
  };

  const exportToExcel = () => {
    if (!filteredAttendances || filteredAttendances.length === 0) {
      Swal.fire('No Data', 'There is no data to export.', 'info');
      return;
    }

    const dataToExport = filteredAttendances.map(att => ({
      ID: att.id,
      Date: att.date,
      // Changed from Teacher to Student
      Student: att.student?.name || 'N/A', // Assuming student has a user.name
      Status: att.status,
      Remark: att.remark,
      Type: att.type, // Include the type in the export
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StudentAttendance"); // Sheet name
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'StudentAttendance.xlsx'); // File name
  };

  // Handle loading and error states for students and attendances
  if (isLoadingStudents || isLoadingAttendances) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading student attendance data...</p>
      </div>
    );
  }

  if (isErrorStudents || isErrorAttendances) {
    return (
      <div className="text-center mt-5 alert alert-danger">
        <p>Error loading data. Please try again later.</p>
      </div>
    );
  }

  // Use availableStudents instead of availableTeachers
  const availableStudents = students || [];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2 className='fw-bold text-primary'>Student Attendance</h2>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Attendance"}
        </Button>
      </div>

      {showForm && (
        <Card className='rounded-4 shadow-sm my-2'>
          <Card.Body>
            <Form className="mb-4" onSubmit={(e) => {
              e.preventDefault();
              handleAddAttendance(formData);
            }}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>Student</Form.Label> {/* Changed from Teacher to Student */}
                  <Form.Select
                    name="studentId" // Changed name to studentId
                    value={formData.studentId}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Choose student</option> {/* Changed to Choose student */}
                    {availableStudents.map((student) => // Map over availableStudents
                      <option key={student.id} value={student.id}>{student.name || student.id}</option>
                    )}
                  </Form.Select>
                </div>
                <div className="col-md-4 mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    <option value="attempt">Attempt</option>
                    <option value="late">Late</option>
                    <option value="absence">Absence</option>
                  </Form.Select>
                </div>
              </div>
              <div className="mb-3">
                <Form.Label>Remark</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="remark"
                  value={formData.remark}
                  onChange={handleFormChange}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="success" type="submit">Submit</Button>
                <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Close</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      <Card className='shadow-sm rounded-4'>
        <Card.Body>
          <Row className="mb-3 align-items-end">
            <Col md={4}>
              <Form.Control
                placeholder="🔍 Search by student name or ID" // Changed search placeholder
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
          {Object.keys(groupedPaginated).length === 0 ? (
            <p className="text-center text-muted mt-5">No attendance records found for the current filters/page.</p>
          ) : (
            <Accordion defaultActiveKey="0">
              {Object.keys(groupedPaginated).sort((a, b) => new Date(b) - new Date(a)).map((date, index) => (
                <Accordion.Item eventKey={index.toString()} key={date}>
                  <Accordion.Header>
                    <span>📅 {date}</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Table hover responsive className="align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Date</th>
                          <th>Student</th> {/* Changed from Teacher to Student */}
                          <th>Status</th>
                          <th>Remark</th>
                          <th className='text-end'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedPaginated[date].map((att, idx) => (
                          editStatus && eAttendance.id === att.id ? (
                            <tr key={att.id}>
                              <td>{idx + 1}</td>
                              <td>
                                <Form.Control
                                  type="date"
                                  name="date"
                                  value={eAttendance.date}
                                  onChange={handleEditChange}
                                />
                              </td>
                              <td>
                                <Form.Select
                                  name="studentId" // Changed name to studentId
                                  value={eAttendance.studentId}
                                  onChange={handleEditChange}
                                >
                                  {availableStudents.map((student) => // Map over availableStudents
                                    <option key={student.id} value={student.id}>{student.name || student.id}</option>
                                  )}
                                </Form.Select>
                              </td>
                              <td>
                                <Form.Select
                                  name="status"
                                  value={eAttendance.status}
                                  onChange={handleEditChange}
                                >
                                  <option value="attempt">Attempt</option>
                                  <option value="late">Late</option>
                                  <option value="absence">Absence</option>
                                </Form.Select>
                              </td>
                              <td>
                                <Form.Control
                                  type="text"
                                  name="remark"
                                  value={eAttendance.remark}
                                  onChange={handleEditChange}
                                />
                              </td>
                              <td className="d-flex">
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleUpdateAttendance(eAttendance)}>
                                  <i className="bx bx-save"></i>
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => setEditStatus(false)}>
                                  <i className="bx bx-x"></i>
                                </Button>
                              </td>
                            </tr>
                          ) : (
                            <tr key={att.id}>
                              <td>{idx + 1}</td>
                              <td>{att.date}</td>
                            
                              <td>{att.student?.user?.name || 'N/A'}</td> {/* Changed from teacher to student */}
                              <td>{att.status}</td>
                              <td>{att.remark}</td>
                              <td className="text-end d-flex justify-content-end gap-2">
                                <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                  <Button variant="outline-primary" size="sm" className="rounded-circle" onClick={() => handleEditAttendance(att)}>
                                    <i className="bx bxs-edit-alt"></i>
                                  </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                                  <Button
                                    variant="outline-danger" size='sm' className='rounded-circle' onClick={() => handleDeleteAttendance(att.id)}
                                  >
                                    <i className="bx bxs-trash"></i>
                                  </Button>
                                </OverlayTrigger>
                              </td>
                            </tr>
                          )
                        ))}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
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
        </Card.Body>
      </Card>
    </div>
  );
};

export default AttendanceList;