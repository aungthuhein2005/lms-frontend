import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useUpdateStudentMutation } from "../features/api/studentApiSlice";
import { useDispatch } from "react-redux";
import { showAlert } from "../features/ui/alertSlice";

export default function EditStudentModal({ show, handleClose, student }) {
    
    const dispatch = useDispatch()
  const [name, setName] = useState(student?.name || "");
  const [enrollDate, setEnrollDate] = useState(student?.enrollDate || "");
  const [updateStudent] = useUpdateStudentMutation();
  useEffect(() => {
    if (show && student) {
      setName(student.name || "");
      const formattedDate = student.enrollDate
        ? new Date(student.enrollDate).toISOString().split("T")[0]
        : "";
      setEnrollDate(formattedDate);
    }
  }, [show, student]);
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(student.id,
        name,
        enrollDate, );
    
    try {
      await updateStudent({
        id: student.id,
        name,
        enrollDate, 
      }).unwrap();
      handleClose();
      dispatch(showAlert({
        show: true,
        title: "Success",
        type: "success",
        message: "Student updated successfully.",
      }))
    } catch (error) {
      console.error("Failed to update student:", error);
        dispatch(showAlert({
            show: true,
            title: "Error",
            type: "danger",
            message: "Failed to update student.",
        }))
    }
  };

  if (!student) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Student</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Student Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Enroll Date</Form.Label>
            <Form.Control
              type="date"
              value={enrollDate}
              onChange={(e) => setEnrollDate(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
