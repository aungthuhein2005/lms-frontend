import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { showAlert } from '../../features/ui/alertSlice';
import { useDispatch } from 'react-redux';

// Grouping Function by Date
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
  // const [show, setShow] = useState(false);
  // const [editingAttendance, setEditingAttendance] = useState(null);
  const [form, setForm] = useState({ date: '' });

  const baseURL = 'http://localhost:8080/attendances';
  const [editStatus, setEditStatus] = useState(false);
  const [eAttendance, setEAttendance] = useState({
    id: '',
    date: '',
    // sessionId: '',
    teacherId: '',
    student: null,
    status: '',
    remark: ''
  });


  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    const res = await axios.get(baseURL);
    setAttendances(res.data);
  };

  const dispatch = useDispatch();
  
  async function addAttendance(newAttendance) {
    await axios
      .post(`http://localhost:8080/attendances`, newAttendance)
      .then((response) => console.log(response.data));

    setShow(false);
    loadAttendances(); 
  }

  
  function editAttendance(attendance) {
    setEditStatus(true);
    setEAttendance(attendance);
    console.log("Editing:", attendance);
  }

  // Update attendance
   function updateAttendance(updatedAttendance) {
     axios
      .put(
        `http://localhost:8080/attendances/${updatedAttendance.id}`,
        updatedAttendance
      )
      .then((response) =>{ console.log(response.data)
        dispatch(showAlert({show:true,message:"Update Success",title:"Success",type:"success"}))
      }).catch((e)=>{
        dispatch(showAlert({show:true,message:"Update Fail",title:"Fail",type:"danger"}))
      })

    console.log("Updated:", updatedAttendance);
    setEditStatus(false);
    setEAttendance({
      id: '',
      date: '',
      // sessionId: '',
      teacherId: '',
      status: '',
      remark: ''
    });
    loadAttendances();
    console.log(updatedAttendance)
  }


  const handleChange = (e) => {
    setEAttendance({ ...eAttendance, [e.target.name]: e.target.value });
  };


  const deleteAttendance =  (id) => {
     axios.delete(`${baseURL}/${id}`).then(response=>{
      dispatch(showAlert({show:true,message:"Delete Success",title:"Success",type:"success"}))
     }).catch((e)=>{
      dispatch(showAlert({show:true,message:"Delete Fail",title:"Fail",type:"danger"}))
     })

     
    loadAttendances();
  };


  const grouped = groupByDate(attendances);

  return (
    <div className="container mt-4">
      <h2>Teacher Attendance</h2>

      <div className="d-flex justify-content-end mb-3">
        <Link to={"create"}><Button variant="primary">
          Add Attendance
        </Button></Link>

      </div>

      <Accordion defaultActiveKey="0">
        {Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).map((date, index) => (
          <Accordion.Item eventKey={index.toString()} key={date}>
            <Accordion.Header>
              <div className="d-flex w-100 justify-content-between align-items-center">
                <span>📅 {date}</span>
              </div>
            </Accordion.Header>

            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    {/* <th>Session ID</th> */}
                    <th>Teacher ID</th>
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
                          <input
                            type="date"
                            name="date"
                            value={eAttendance.date}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </td>
                        {/* <td>
                          <input
                            type="text"
                            name="sessionId"
                            value={eAttendance.sessionId}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </td> */}
                        <td>
                          <input
                            type="text"
                            name="teacherId"
                            value={eAttendance.teacherId}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="status"
                            value={eAttendance.status}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="remark"
                            value={eAttendance.remark}
                            onChange={handleChange}
                            className="form-control"
                          />
                        </td>
                        <td className="d-flex">
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => updateAttendance(eAttendance)}
                          >
                            <i className="bx bx-save"></i>
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditStatus(false)}
                          >
                            <i className="bx bx-x"></i>
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={att.id}>
                        <td>{idx + 1}</td>
                        <td>{att.date}</td>
                        {/* <td>{att.sessionId}</td> */}
                        <td>{att.teacherId}</td>
                        
                        <td>{att.status}</td>
                        <td>{att.remark}</td>
                        <td className="d-flex">
                          <Button
                            variant="primary"
                            size="sm"
                            className="me-2"
                            onClick={() => editAttendance(att)}
                          >
                            <i className="bx bxs-edit-alt"></i>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteAttendance(att.id)}
                          >
                            <i className="bx bxs-trash-alt"></i>
                          </Button>
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
