import React, { useEffect, useState } from "react";
import { Table, Card, Badge } from "react-bootstrap";
import { FaUserGraduate } from "react-icons/fa";
import DateHelper from "../helpers/DateHelper";
import axios from "axios";

export default function StudentList({ students = [],courseId }) {
    console.log(courseId);
    
   const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    const fetchProgress = async () => {
      const newMap = {};
      for (let student of students) {
        
        try {
          const resp = await axios.get(`http://localhost:8080/progress/progress-percent`, {
            params: {
              studentId: student.id,
              courseId: courseId, 
            },
          });
          
          newMap[student.id] = resp.data;
        } catch (error) {
          
          newMap[student.id] = 0;
        }
      }
      setProgressMap(newMap);
    };

    if (students.length > 0) {
      fetchProgress();
    }
  }, [students, courseId]);
  

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
                 <th>Progress</th> 
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student?.name || "Unknown"}</td>
                  <td>{student?.email || "N/A"}</td>
                  <td>{DateHelper.formatYMD(student.enrollDate) || "N/A"}</td>
                  <td>
          <Badge bg="secondary">
            {progressMap[student.id] ?? "Loading..."}%
          </Badge>
        </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
