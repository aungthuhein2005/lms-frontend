import { Table } from 'react-bootstrap';

export default function ClassScheduleTable({ schedules = [] }) {
    console.log(schedules);
    
  return (
    <div className="mt-4">
      <h5 className="fw-bold mb-3">Class Schedule</h5>
      <Table striped bordered hover responsive className="rounded-3 overflow-hidden">
        <thead className="table-light">
          <tr>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length > 0 ? (
            schedules.map((item, index) => (
              <tr key={index}>
                <td>{item.dayOfWeek}</td>
                <td>{item.startTime}</td>
                <td>{item.endTime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No schedule available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
