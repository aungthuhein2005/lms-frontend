import React,{useEffect,useState} from 'react';
import axios from 'axios';
import { Table,Button, Form } from 'react-bootstrap';
import { useDeleteTeacherMutation, useGetTeachersQuery } from '../../features/api/teacherApiSlice';
import DateHelper from '../../helpers/DateHelper';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../features/ui/alertSlice';
import { Link } from 'react-router-dom';
import AssignModal from '../../components/AssignModal';
import { useGetClassesQuery } from '../../features/api/classApiSlice';
import { setOpenModal } from '../../features/ui/uiSlice';

export default function Teachers() {

  const dispatch = useDispatch();

  const { data, isLoading, error } = useGetTeachersQuery();
  const {data:classes} = useGetClassesQuery();
  const [deleteTeacher] = useDeleteTeacherMutation();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  
  if( isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

   const handleAssignToClass = async (e) => {
      e.preventDefault()
      console.log(selectedTeacherId,selectedClass);
      
    }

  const handleDeleteTeacher = async (id) => {
    const result = window.confirm('Are you sure you want to delete this teacher?');
    if (result) {
      try {
        await deleteTeacher(id).unwrap();
        dispatch(showAlert({
          show: true,
          message: 'Teacher deleted successfully',
          title: 'Success',
          type: 'success'
        }))
        
      } catch (error) {
        console.error('Failed to delete teacher:', error);
        
        dispatch(showAlert({
          show: true,
          message: 'Failed to delete teacher',
          title: 'Error',
          type: 'danger'
        }))
      }
    }
  }

  return (
    <div>
       <AssignModal>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicClass">
              <Form.Label>Class</Form.Label>
              <Form.Select aria-label="Select class" value={selectedClass} onChange={(e) => setSelectedClass(Number(e.target.value))}>
                <option>Select class to assign</option>
                {classes?.map(clas => (
                  <option key={clas.id} value={clas.id}>
                    {clas.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary"  onClick={(e)=>handleAssignToClass(e)}>
              Assign
            </Button>
          </Form>
        </AssignModal>
    <div className="container mt-5">
      <h1 className="mb-4">Teacher</h1>
       <Table striped bordered hover>
        <thead className="table">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Hire Date</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="12" className="text-center">No teachers found.</td>
            </tr>
          ) : (
            data.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{DateHelper.formatYMD(teacher.hireDate)}</td>
                <td className='d-flex gap-2'>
                  
                  <Button variant="primary" size="sm" >
                                      <i className="bx bxs-edit"></i>
                                    </Button>
                                    <Link to={`/admin/teachers/${teacher.id}`}>
                                    <Button variant="success" size="sm" >
                                                          <i className="bx bxs-detail"></i>
                                                        </Button></Link>
                   <Button variant="warning" size="sm" onClick={() => {
                                         dispatch(setOpenModal(true))
                                         setSelectedTeacherId(teacher.id)
                                       }}>
                    <i className="bx bx-plus-circle text-white"></i>
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteTeacher(teacher.id)}>
                    <i className='bx bxs-trash-alt'></i>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  
    </div>
  );
}