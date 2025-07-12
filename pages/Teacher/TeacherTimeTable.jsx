import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Card } from "react-bootstrap";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00"
];

export default function TeacherTimetable({ teacherId }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/teachers/teachers/${1}/timetable`);
        setSchedules(res.data);
        console.log(res.data);
        
      } catch (err) {
        setError("Failed to load timetable");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [teacherId]);

  // Group by day and time
  const getScheduleForSlot = (day, time) => {
    return schedules.find(
      (s) => s.dayOfWeek === day.toUpperCase() && s.startTime === time
    );
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4 text-center">📅 Teacher's Weekly Timetable</h3>
      <Card className="shadow-sm rounded-4">
        <Card.Body>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading schedule...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <div className="table-responsive">
              <Table bordered hover className="align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>Time</th>
                    {daysOfWeek.map((day) => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time) => (
                    <tr key={time}>
                      <td className="fw-semibold">{time}</td>
                      {daysOfWeek.map((day) => {
                        const schedule = getScheduleForSlot(day, time);
                        return (
                          <td key={day + time} style={{ minWidth: 120 }}>
                            {schedule ? (
                              <>
                                <div className="fw-bold">{schedule.classEntity.name}</div>
                                <div className="text-muted small">{schedule.classEntity.course.title}</div>
                                <div className="text-muted small">{schedule.startTime} - {schedule.endTime}</div>
                              </>
                            ) : (
                              <span className="text-muted small">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
