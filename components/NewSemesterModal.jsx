import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAddSemesterMutation, useUpdateSemesterMutation } from '../features/api/semesterServiceApiSlice';
import { useDispatch } from 'react-redux';
import { showAlert } from '../features/ui/alertSlice';

export default function NewSemesterModal({ id, show, handleClose, semester = null ,refetch}) {
  const dispatch = useDispatch();

  const [createSemester, { isLoading: isCreating }] = useAddSemesterMutation();
  const [updateSemester, { isLoading: isUpdating }] = useUpdateSemesterMutation();

  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    academic_year_id: Number(id),
  });

  useEffect(() => {
    if (semester) {
      setFormData({
        name: semester.name || '',
        start_date: semester.startDate || '',
        end_date: semester.endDate || '',
        academic_year_id: semester.academic_year_id || Number(id),
      });
    } else {
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        academic_year_id: Number(id),
      });
    }
  }, [semester, id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const action = semester ? updateSemester : createSemester;
    const payload = semester ? { id: semester.id, ...formData } : formData;

    try {
      await action(payload).unwrap();
      dispatch(showAlert({
        message: semester ? 'Semester updated successfully!' : 'Semester created successfully!',
        type: 'success',
        title: 'Success',
      }));
      handleClose();
      refetch(); // Refetch semesters to update the list
    } catch (error) {
      console.error('Failed to save semester:', error);
      dispatch(showAlert({
        message: 'Failed to save semester. Please try again.',
        type: 'danger',
        title: 'Error',
      }));
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{semester ? 'Edit Semester' : 'Create New Semester'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label className="form-label">Semester Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. Fall 2025"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="end_date"
              className="form-control"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSave} disabled={isCreating || isUpdating}>
          {semester ? 'Update Semester' : 'Save Semester'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
