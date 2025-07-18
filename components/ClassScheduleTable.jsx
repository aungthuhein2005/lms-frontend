import { Table } from 'react-bootstrap';
import { formatTime24to12 } from '../helpers/timeFormatter';

export default function ClassScheduleTable({ schedules = [] }) {

    
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
                <td>{formatTime24to12(item.startTime)}</td>
                <td>{formatTime24to12(item.endTime)}</td>
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
