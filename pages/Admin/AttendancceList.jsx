import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Accordion, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../features/ui/alertSlice';
import Swal from 'sweetalert2';
import { useGetTeachersQuery } from '../../features/api/teacherApiSlice';

const groupByDate = (data) => {
  return data.reduce((groups, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
};

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [editStatus, setEditStatus] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();

  const {data:teachers,isLoading,isError} = useGetTeachersQuery();

  const [eAttendance, setEAttendance] = useState({
    id: '',
    date: '',
    teacherId: '',
    status: '',
    remark: ''
  });

  const [formData, setFormData] = useState({
    date: '',
    teacherId: '',
    status: 'attempt',
    remark: ''
  });

  const baseURL = 'http://localhost:8080/attendances';

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    const res = await axios.get(baseURL);
    setAttendances(res.data);
    
  };

  const addAttendance = async (newAttendance) => {
    
    try {
      const response = await axios.post(baseURL, newAttendance);
      dispatch(showAlert({ show: true, message: "Add Success", title: "Success", type: "success" }));
      setFormData({ date: '', teacherId: '', status: 'attempt', remark: '' });
      setShowForm(false);
      setAttendances(prev => [...prev, response.data]);
    } catch (error) {
      dispatch(showAlert({ show: true, message: "Add Fail", title: "Fail", type: "danger" }));
    }
  };

  const editAttendance = (attendance) => {
    setEditStatus(true);
    setEAttendance(attendance);
  };

  const updateAttendance = (updatedAttendance) => {
    axios.put(`${baseURL}/${updatedAttendance.id}`, updatedAttendance)
      .then(() => {
        dispatch(showAlert({ show: true, message: "Update Success", title: "Success", type: "success" }));
        setAttendances(prev => prev.map(item => item.id === updatedAttendance.id ? updatedAttendance : item));

        Swal.fire({
          icon: 'success',
          title: 'Update Success',
          text: 'Attendance has been updated.',
          timer: 1000,
          showConfirmButton: false
        });
      })
      .catch(() => {
        dispatch(showAlert({ show: true, message: "Update Fail", title: "Fail", type: "danger" }));

        Swal.fire({
          icon: 'error',
          title: 'Update Fail',
          text: 'Failed to update attendance.',
          timer: 1000,
          showConfirmButton: false
        });
      });

    setEditStatus(false);
    setEAttendance({ id: '', date: '', teacherId: '', status: '', remark: '' });
  };

  const deleteAttendance = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This attendance record will be deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${baseURL}/${id}`)
          .then(() => {
            dispatch(showAlert({ show: true, message: "Delete Success", title: "Success", type: "success" }));
            setAttendances(prev => prev.filter(item => item.id !== id));

            Swal.fire('Deleted!', 'Attendance record has been deleted.', 'success');
          })
          .catch(() => {
            dispatch(showAlert({ show: true, message: "Delete Fail", title: "Fail", type: "danger" }));
            Swal.fire('Error!', 'Failed to delete attendance.', 'error');
          });
      }
    });
  };

  const handleChange = (e) => {
    setEAttendance({ ...eAttendance, [e.target.name]: e.target.value });
  };

  const grouped = groupByDate(attendances);
  // const teachers = [
  //   { id: 1, name: "Daw Su" },
  //   { id: 2, name: "Daw Thin Thin Hla" },
  //   { id: 3, name: "U Kyaw" },
  //   { id: 4, name: "Daw Hla Myit" },
  //   { id: 5, name: "U Myit" },
  //   { id: 6, name: "U Myat Thuta" },
  //   { id: 7, name: "Daw Myit Khin" },
  //   { id: 8, name: "U Aye Thiha Kyaw" },
  //   { id: 9, name: "Daw Thiri Swe" },
  //   { id: 10, name: "Daw Khai Khai Linn" },

  // ]

  return (
    <div className="container mt-4">
      <h2>Teacher Attendance</h2>

      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Attendance"}
        </Button>
      </div>

      {showForm && (
        <Form className="mb-4" onSubmit={(e) => {
          e.preventDefault();
          addAttendance(formData);
        }}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <Form.Label>Teacher</Form.Label>
              <Form.Select
                type="number"
                name="teacherId"
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                required
              >
                <option value="0">Choose teacher</option>
                {teachers.map((teacher) =>
                  <option value={teacher.id}>{teacher.name}</option>
                )}

              </Form.Select>

            </div>
            <div className="col-md-4 mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="attempt">Attempt</option>
                <option value="late">Late</option>
                <option value="absence">Absence</option>
              </Form.Select>
            </div>
          </div>
          <div className="mb-3">
            <Form.Label>Remark</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="remark"
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
            />
          </div>
          <Button variant="success" type="submit">Submit</Button>
        </Form>
      )}

      <Accordion defaultActiveKey="0">
        {Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).map((date, index) => (
          <Accordion.Item eventKey={index.toString()} key={date}>
            <Accordion.Header>
              <span>📅 {date}</span>
            </Accordion.Header><Accordion.Body>
             <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Teacher</th>
                    <th>Status</th>
                    <th>Remark</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[date].map((att, idx) => (
                    editStatus && eAttendance.id === att.id ? (
                      <tr key={att.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <Form.Control
                            type="date"
                            name="date"
                            value={eAttendance.date}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <Form.Select
                            type="number"
                            name="teacherId"
                            value={eAttendance.teacherId}
                            onChange={handleChange}
                          >
                            {teachers.map((teacher) =>
                              <option value={teacher.id}>{teacher.name}</option>
                            )}
                          </Form.Select>
                        </td>
                        <td>
                          <Form.Select
                            type="text"
                            name="status"
                            value={eAttendance.status}
                            onChange={handleChange}
                          >
                            <option value="attempt">Attempt</option>
                            <option value="late">Late</option>
                            <option value="absence">Absence</option>

                          </Form.Select>
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            name="remark"
                            value={eAttendance.remark}
                            onChange={handleChange}
                          />
                        </td>
                        <td className="d-flex">
                          <Button variant="warning" size="sm" className="me-2" onClick={() => updateAttendance(eAttendance)}>
                            <i className="bx bx-save"></i>
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => setEditStatus(false)}>
                            <i className="bx bx-x"></i>
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={att.id}>
                        <td>{idx + 1}</td>
                        <td>{att.date}</td>
                        <td>{att.teacher.user.name}</td>
                        <td>{att.status}</td>
                        <td>{att.remark}</td>
                        <td className="text-end d-flex justify-content-end gap-2">
                          <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                          <Button variant="outline-primary" size="sm" className="rounded-circle" onClick={() => editAttendance(att)}>
                            <i className="bx bxs-edit-alt"></i>
                          </Button>
                          </OverlayTrigger>
                          <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                          <Button
                            variant="outline-danger" size='sm' className='rounded-circle' onClick={() => deleteAttendance(att.id)}
                          >
                            <i className="bx bxs-trash"></i>
                          </Button></OverlayTrigger>

                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default AttendanceList;