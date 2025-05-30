import React, { useState } from "react";
import { Button, Card, Form, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showAlert } from "../../features/ui/alertSlice";


function CreateTeacherAttendancePage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    sessionId: "",
    teacherId: "",
    status: "Present",
    remark: "",
  });
  const [attendanceList, setAttendanceList] = useState([]);

  const baseURL = 'http://localhost:8080/attendances';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log({
      date: formData.date,
      sessionId: Number(formData.sessionId),
      teacherId: Number(formData.teacherId),
      status: "attempt",
      type: "TEACHER_ATTENDANCE",
      remark: formData.remark,
    });

    const response = await axios.post(baseURL, {
      date: formData.date,
      sessionId: Number(formData.sessionId),
      teacherId: Number(formData.teacherId),
      status: "attempt",
      type: "TEACHER_ATTENDANCE",
      remark: formData.remark,
    });

    setAttendanceList([...attendanceList, response.data]); // frontend table
    setFormData({
      date: "",
      sessionId: "",
      teacherId: "",
      status: "Present",
      remark: "",
    });
    setShowForm(false);

    dispatch(showAlert({
      show: true,
      message: "Submit Success",
      title: "Success",
      type: "success"
    }));
  } catch (error) {
    console.error("Error submitting attendance:", error);

    dispatch(showAlert({
      show: true,
      message: "Submit Fail",
      title: "Fail",
      type: "danger"
    }));
  }
};


  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={() => setShowForm(true)}>
        Add Attendance
      </Button>

      {showForm && (
        <Card className="mt-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Session ID</Form.Label>
                    <Form.Control
                      type="number"
                      name="sessionId"
                      value={formData.sessionId}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Teacher ID</Form.Label>
                    <Form.Control
                      type="number"
                      name="teacherId"
                      value={formData.teacherId}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option>Present</option>
                      <option>Absent</option>
                      <option>Late</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Remark</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="remark"
                      value={formData.remark}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="success" type="submit">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Session ID</th>
            <th>Teacher ID</th>
            <th>Status</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {attendanceList.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.date}</td>
              <td>{item.sessionId}</td>
              <td>{item.teacherId}</td>
              <td>{item.status}</td>
              <td>{item.remark}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default CreateTeacherAttendancePage;
