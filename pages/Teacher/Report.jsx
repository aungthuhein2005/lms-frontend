import React from "react";
import { Card, Button, Table, Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Report() {
  const reportList = [
    {
      name: "Student Grades Report",
      description: "Shows students' grades by class or subject.",
      path: "/admin/reports/student-grades",
    },
    {
      name: "Student Attendance Report",
      description: "Displays attendance records of teachers.",
      path: "/admin/reports/teacher-attendance",
    },
    {
      name: "Class Performance Summary",
      description: "Shows performance summaries of each class.",
      path: "/admin/reports/class-performance",
    },
    {
      name: "Course Peformance Summary",
      description: "Lists how many students enrolled in each course.",
      path: "/admin/reports/course-enrollment",
    },
  ];

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-primary mb-4">📊 Reports</h2>

      <Card className="shadow-sm rounded-4">
        <Card.Body>
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Report Name</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportList.map((report, index) => (
                <tr key={index}>
                  <td>{report.name}</td>
                  <td>{report.description}</td>
                  <td className="text-end d-flex justify-content-end gap-2">
                    <OverlayTrigger overlay={<Tooltip>View Report</Tooltip>}>
                      <Link to={report.path}>
                        <Button variant="outline-primary" size="sm">
                          <i className="bx bx-show"></i> View
                        </Button>
                      </Link>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Export Report</Tooltip>}>
                      <Button variant="outline-success" size="sm" onClick={() => alert(`Exporting: ${report.name}`)}>
                        <i className="bx bx-download"></i> Export
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
