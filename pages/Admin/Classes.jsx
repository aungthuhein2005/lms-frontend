import axios from 'axios';
import { Table, Button, Modal,Row,Col, Form, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetTeachersQuery } from '../../features/api/teacherApiSlice';
import { useGetSemestersByAcademicYearIdQuery, useGetSemestersQuery } from '../../features/api/semesterServiceApiSlice';
import { useAddClassMutation, useDeleteClassMutation, useGetClassesQuery } from '../../features/api/classApiSlice';
import {useGetAcademicYearsQuery } from '../../features/api/academicYearApiSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import ReactPaginate from 'react-paginate';

export default function Classes() {
 const {
  data: classes = [],
  isLoading: isClassesLoading,
  refetch: refetchClasses,
} = useGetClassesQuery();
  console.log(classes);
  
  const [addClassMutation] = useAddClassMutation();
  const [updateClassMutation] = useAddClassMutation();
  const [deletedClassMutation] = useDeleteClassMutation();
  const { data: academicYear, isLoading, isError } = useGetAcademicYearsQuery();

  const [coursesData,setCoursesData] = useState([]);
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('');
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  const [eClass, setEClass] = useState({ id: '', name: '', description: '', schedule: '' });
  const [editStatus, setEditStatus] = useState(false);
const [schedules, setSchedules] = useState([
  { dayOfWeek: '', startTime: '', endTime: '' },
]);
 const { data: teachersData = [] } = useGetTeachersQuery();
const { data: semestersData = [] } = useGetSemestersByAcademicYearIdQuery(
  selectedAcademicYearId || skipToken
);
const [currentPage, setCurrentPage] = useState(0);
const itemsPerPage = 8;
const filteredClasses = classes?.filter((cls) =>
  cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  cls.description?.toLowerCase().includes(searchTerm.toLowerCase())
);
const pageCount = Math.ceil(filteredClasses?.length / itemsPerPage);
const paginatedClasses = filteredClasses?.slice(
  currentPage * itemsPerPage,
  (currentPage + 1) * itemsPerPage
);

const handlePageChange = ({ selected }) => setCurrentPage(selected);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getCourses = async () => {
    const response = await axios.get('http://localhost:8080/courses/all');
    setCoursesData(response.data);
    
  }

const handleScheduleChange = (index, field, value) => {
  const updatedSchedules = [...schedules];
  updatedSchedules[index][field] = value;
  setSchedules(updatedSchedules);
};

const addSchedule = () => {
  setSchedules([...schedules, { dayOfWeek: '', startTime: '', endTime: '' }]);
};

const removeSchedule = (index) => {
  const updatedSchedules = schedules.filter((_, i) => i !== index);
  setSchedules(updatedSchedules);
};

  useEffect(()=>{
    getCourses();
  },[])

  const handleAddClass = async () => {
    const newClass = {
      name,
      description,
      schedule,
      semester_id: Number(selectedSemesterId),
      course_id: Number(selectedCourseId) || 1,
      teacher_id: Number(selectedTeacherId),
       schedules: schedules.map((s) => ({
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
    })),
    };
    
    try {
    await addClassMutation(newClass).unwrap();
    setName('');
    setDescription('');
    setSchedule('');
    setSelectedSemesterId('');
    setSelectedCourseId('');
    setSelectedTeacherId('');
    setSchedules([{ dayOfWeek: '', startTime: '', endTime: '' }]);
    handleClose();
  } catch (error) {
    console.error("Failed to add class:", error);
  }
  };

const editClass = (classData) => {
  setEditStatus(true);
  setEClass(classData);
  setName(classData.name);
  setDescription(classData.description);
  setSelectedSemesterId(classData.semester?.id || '');
  setSelectedCourseId(classData.course?.id || '');
  setSelectedTeacherId(classData.teacher?.id || '');
  setSchedules(
    classData.schedules?.map((s) => ({
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
    })) || [{ dayOfWeek: '', startTime: '', endTime: '' }]
  );
  setShow(true); // open modal
};


  const updateClass = async (updatedClass) => {
    console.log(updatedClass);
    
    // updateClassMutation({ id: updatedClass.id, ...updatedClass });
  };

  const handleUpdateClass = async () => {
  const updatedClass = {
    id: eClass.id,
    name,
    description,
    semester_id: Number(selectedSemesterId),
    course_id: Number(selectedCourseId),
    teacher_id: Number(selectedTeacherId),
    schedules,
  };

  try {
    await updateClassMutation(updatedClass).unwrap();
    setEditStatus(false);
    resetForm();
    handleClose();
    refetchClasses(); // refresh data
  } catch (error) {
    console.error("Update failed:", error);
  }
};

const resetForm = () => {
  setName('');
  setDescription('');
  setSelectedSemesterId('');
  setSelectedCourseId('');
  setSelectedTeacherId('');
  setSchedules([{ dayOfWeek: '', startTime: '', endTime: '' }]);
};



const exportToExcel = () => {
  const exportData = filteredClasses.map(cls => ({
    ID: cls.id,
    Name: cls.name,
    Description: cls.description,
    Semester: cls.semester?.name,
    Course: cls.course?.title,
    Teacher: cls.teacher?.name
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Classes");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(dataBlob, "classes.xlsx");
};


  const deletedClass = async (id) => {
    deletedClassMutation(id);
  };

  return (
<div className="container py-5">
  <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">Classes</h2>
<Button variant="primary" className="mt-3 mt-md-0" onClick={handleShow}>
      <i className="bx bx-plus-circle me-2"></i> Add Class
    </Button>
        </div>


      {/* Add/Edit Class Modal */}
      <Modal show={show} onHide={handleClose} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>{editStatus ? 'Edit Class' : 'Add New Class'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <h6 className="fw-semibold mb-3 text-secondary">Basic Information</h6>
      <Form.Group className="mb-3">
        <Form.Control
          placeholder="Class Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Control
          as="textarea"
          placeholder="Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Select
            value={selectedAcademicYearId}
            onChange={(e) => setSelectedAcademicYearId(e.target.value)}
          >
            <option value="">Select Academic Year</option>
            {academicYear?.map((year) => (
              <option key={year.id} value={year.id}>{year.name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Select
            value={selectedSemesterId}
            onChange={(e) => setSelectedSemesterId(e.target.value)}
          >
            <option value="">Select Semester</option>
            {semestersData.map((sem) => (
              <option key={sem.id} value={sem.id}>{sem.name}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">Select Course</option>
            {coursesData.map((course) => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
          >
            <option value="">Select Teacher</option>
            {teachersData.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <hr />
      <h6 className="fw-semibold text-secondary">Class Schedule</h6>
      {schedules.map((schedule, index) => (
        <Row key={index} className="align-items-center mb-3">
          <Col md={4}>
            <Form.Select
              value={schedule.dayOfWeek}
              onChange={(e) => handleScheduleChange(index, 'dayOfWeek', e.target.value)}
              required
            >
              <option value="">Select Day</option>
              <option value="MONDAY">Monday</option>
              <option value="TUESDAY">Tuesday</option>
              <option value="WEDNESDAY">Wednesday</option>
              <option value="THURSDAY">Thursday</option>
              <option value="FRIDAY">Friday</option>
              <option value="SATURDAY">Saturday</option>
              <option value="SUNDAY">Sunday</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Control
              type="time"
              value={schedule.startTime}
              onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="time"
              value={schedule.endTime}
              onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
              required
            />
          </Col>
          <Col md={2}>
            <Button
              variant="danger"
              size="sm"
              onClick={() => removeSchedule(index)}
              disabled={schedules.length === 1}
            >
              ❌
            </Button>
          </Col>
        </Row>
      ))}

      <Button
        variant="outline-primary"
        size="sm"
        onClick={addSchedule}
        className="mb-3"
      >
        ➕ Add Another Schedule
      </Button>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
    <Button variant="primary" onClick={editStatus ? handleUpdateClass : handleAddClass}>
      <i className="bx bx-save me-2"></i> {editStatus ? 'Update' : 'Save'}
    </Button>
  </Modal.Footer>
</Modal>


      {/* Table Card */}
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
          <Button variant="secondary" onClick={resetForm}>Reset</Button>
        </Col>
        <Col md={{ span: 2, offset: 4 }} className="text-end">
          <Button variant="success" onClick={exportToExcel}>Export Excel</Button>
        </Col>
      </Row>

          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Class Code</th>
                <th>Name</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
           <tbody>
  {paginatedClasses.length === 0 ? (
    <tr><td colSpan="4" className="text-center py-4">No teachers found.</td></tr>
  ) :
  (paginatedClasses?.map((classData) => (
    <tr key={classData.id}>
      <td>{classData.id}</td>
      <td>{classData.name}</td>
      <td>{classData.description}</td>
      <td className="text-end d-flex justify-content-end gap-2">
        {/* Edit Button */}
        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
          <Button
            variant="outline-warning"
            size="sm"
            className="rounded-circle"
            onClick={() => editClass(classData)}
          >
            <i className="bx bxs-edit-alt"></i>
          </Button>
        </OverlayTrigger>

        {/* Delete Button */}
        <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
          <Button
            variant="outline-danger"
            size="sm"
            className="rounded-circle"
            onClick={() => deletedClass(classData.id)}
          >
            <i className="bx bxs-trash"></i>
          </Button>
        </OverlayTrigger>

        {/* Details Button */}
        <OverlayTrigger overlay={<Tooltip>Details</Tooltip>}>
          <Link to={`/admin/classes/${classData.id}`}>
            <Button variant="outline-success" size="sm" className="rounded-circle">
              <i className="bx bxs-detail"></i>
            </Button>
          </Link>
        </OverlayTrigger>
      </td>
    </tr>)
  ))}
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
    forcePage={currentPage}
  />
</div>

        </Card.Body>
      </Card>
    </div>
  );
}
