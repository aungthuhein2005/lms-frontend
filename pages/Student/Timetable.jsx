import React from 'react';
import { Accordion, Container, Card, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useGetStudentTimetableQuery } from '../../features/api/studentApiSlice';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import ClassScheduleTable from '../../components/ClassScheduleTable';

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
  const { roleId } = useSelector((state) => state.auth.user);
  const { data, isLoading, error } = useGetStudentTimetableQuery(roleId);

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  const schedules = data?.schedules || [];

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Class Timetable</h2>
      <Accordion defaultActiveKey="0">
        {schedules.map((cls, index) => (
          <Accordion.Item eventKey={index.toString()} key={cls.classId}>
            <Accordion.Header>
              <strong>{cls.className}</strong>
            </Accordion.Header>
            <Accordion.Body>
              {cls.schedules.length === 0 ? (
                <p className="text-muted">No schedule available.</p>
              ) : (
                <ClassScheduleTable schedules={cls.schedules} />

              )
              }

            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}

export default Timetable;
