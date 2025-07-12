import React from "react";
import { Table, Card, Badge } from "react-bootstrap";
import { FaUserGraduate } from "react-icons/fa";
import DateHelper from "../helpers/DateHelper";

export default function StudentList({ students = [] }) {
    console.log(students);
    
  return (
    <Card className="shadow-sm rounded-4 mt-4">
      <Card.Body>
        <h4 className="mb-3 d-flex align-items-center">
          <FaUserGraduate className="me-2" />
          Enrolled Students
          <Badge bg="info" className="ms-2">{students.length}</Badge>
        </h4>

        {students.length === 0 ? (
          <p className="text-muted">No students enrolled yet.</p>
        ) : (
          <Table responsive hover bordered>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Enrollment Date</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student?.name || "Unknown"}</td>
                  <td>{student?.email || "N/A"}</td>
                  <td>{DateHelper.formatYMD(student.enrollDate) || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
