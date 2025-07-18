import React, { useState } from 'react';
import { Accordion, Container, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { useGetStudentTimetableQuery } from '../../features/api/studentApiSlice';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import ClassScheduleTable from '../../components/ClassScheduleTable';

// The dayNames object is not used in this component, but keeping it for context
const dayNames = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday'
};

function Timetable() {
  // ✅ All hooks are now at the top level, before any conditions.
  const { roleId } = useSelector((state) => state.auth.user);
  const { data, isLoading, error } = useGetStudentTimetableQuery(roleId);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // ✅ Conditional returns now come AFTER all hooks have been called.
  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error?.data?.message || error.message} />;

  const schedules = data?.schedules || [];
  const itemsPerPage = 5;

  const filteredSchedules = schedules.filter(cls =>
    cls.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredSchedules.length / itemsPerPage);
  const paginatedSchedules = filteredSchedules.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary fw-bold">Class Timetable</h2>

      <Form.Control
        type="text"
        placeholder="🔍 Search by class name"
        className="mb-3"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(0); // Reset to first page on search
        }}
      />

      <Accordion defaultActiveKey="0">
        {paginatedSchedules.map((cls, index) => (
          <Accordion.Item eventKey={index.toString()} key={cls.classId}>
            <Accordion.Header>
              <strong>{cls.className}</strong>
            </Accordion.Header>
            <Accordion.Body>
              {cls.schedules.length === 0 ? (
                <p className="text-muted">No schedule available.</p>
              ) : (
                <ClassScheduleTable schedules={cls.schedules} />
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

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
        </div>
      )}
    </Container>
  );
}

export default Timetable;