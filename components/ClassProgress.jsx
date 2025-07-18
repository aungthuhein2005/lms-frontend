import React, { useState } from "react";
import {
  Card,
  Table,
  ProgressBar,
  Row,
  Col,
  Badge,
  Dropdown,
  Button
} from "react-bootstrap";
import {
  Book,
  PeopleFill,
  AwardFill,
  ArrowUpShort,
  ArrowDownShort,
  Download,
  ClipboardCheck,
  ClipboardData
} from "react-bootstrap-icons";
import { useGetClassSummaryQuery } from "../features/api/teacherDashboardApiSlice";
import { useGetClassByTeacherIdQuery } from "../features/api/classApiSlice";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


export default function ClassProgress({teacherId}) {
  const [selectedClass, setSelectedClass] = useState(1);
  const {data: classes} = useGetClassByTeacherIdQuery(teacherId);
  const {data: classSummary,isLoading,isError} = useGetClassSummaryQuery(selectedClass);

  
const exportToExcel = () => {
  const selectedClassName = classes?.find((cls) => cls.id === selectedClass)?.name || "Unknown Class";

  const exportData = [
    {
      "Class Name": selectedClassName,
      "Total Students": classSummary?.studentCount || 0,
      "Assignments": classSummary?.assignmentCount || 0,
      "Exams": classSummary?.examCount || 0,
      "Progress (%)": classSummary?.classProgress?.toFixed(2) || 0,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Class Summary');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, `${selectedClassName.replace(/\s+/g, "_")}_summary.xlsx`);
};

const handleExport = () => {
  if (!classSummary) {
    alert("Class summary not loaded yet.");
    return;
  }
  exportToExcel();
};

  return (
    <div className="container py-4">
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">

          {/* Header */}
          <Row className="align-items-center mb-4">
            <Col>
              <h4 className="fw-bold text-primary d-flex align-items-center">
                <Book className="me-2" /> Class Dashboard: {''}
              </h4>
            </Col>
            <Col className="d-flex justify-content-end align-items-center gap-3">
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="rounded-pill px-3">
  {classes?.find((cls) => cls.id === selectedClass)?.name || "Select Class"}
</Dropdown.Toggle>

                <Dropdown.Menu>
                 {classes?.map((cls) => (
                    <Dropdown.Item key={cls.id} onClick={() => setSelectedClass(cls.id)}>
                      {cls.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="primary" onClick={handleExport} className="rounded-pill px-3">
                <Download className="me-2" size={18} />
                Export
              </Button>
            </Col>
          </Row>

          {/* Summary Cards */}
          <Row className="g-4 mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100 rounded-3">
                <Card.Body>
                  <div className="text-muted small mb-2">Total Students</div>
                  <div className="d-flex align-items-center gap-3">
                    <PeopleFill size={28} className="text-primary" />
                    <div className="fs-4 fw-bold">{classSummary?.studentCount}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm h-100 rounded-3">
                <Card.Body>
                  <div className="text-muted small mb-2">Average Score</div>
                  <div className="d-flex align-items-center gap-3">
                    <AwardFill size={28} className="text-warning" />
                    <div className="fs-4 fw-bold">{0}</div>
                    
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm h-100 rounded-3">
                <Card.Body>
                  <div className="text-muted small mb-2">Assignments Created</div>
                  <div className="d-flex align-items-center gap-3">
                    <ClipboardCheck size={28} className="text-info" />
                    <div className="fs-4 fw-bold">{classSummary?.assignmentCount}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm h-100 rounded-3">
                <Card.Body>
                  <div className="text-muted small mb-2">Exams Created</div>
                  <div className="d-flex align-items-center gap-3">
                    <ClipboardData size={28} className="text-danger" />
                    <div className="fs-4 fw-bold">{classSummary?.examCount}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Class Progress Bar */}
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm rounded-3">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Class Progress</span>
                    <span className="fw-semibold">{classSummary?.classProgress.toFixed(0)}%</span>
                  </div>
                  <ProgressBar now={classSummary?.classProgress} label={`${classSummary?.classProgress.toFixed(0)}%`} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

        </Card.Body>
      </Card>
    </div>
  );
}
