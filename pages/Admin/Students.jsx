  import React, { useState } from 'react'
  import { Badge, Button, Form, Table } from 'react-bootstrap'
  import { Link } from 'react-router-dom'
  import AssignModal from '../../components/AssignModal'
  import AddStudentModal from '../../components/AddStudentModal'
  import { useDispatch } from 'react-redux'
  import { setOpenModal } from '../../features/ui/uiSlice'
  import { useAssignToClassMutation, useGetStudentsQuery, useRestoreStudentMutation, useSoftDeleteStudentMutation } from '../../features/api/studentApiSlice'
import { useGetClassesQuery } from '../../features/api/classApiSlice'
import DateHelper from '../../helpers/DateHelper'
import EditStudentModal from '../../components/EditStudentModal'
import { confirm } from '../../helpers/confirm'
import { showAlert } from '../../features/ui/alertSlice'



  export default function Students() {
    const { data: students, isLoading, error, refetch } = useGetStudentsQuery()
    const {data: classes} = useGetClassesQuery();
    const dispatch = useDispatch()
    const [softDeleteStudent] = useSoftDeleteStudentMutation()
    const [restoreStudent] = useRestoreStudentMutation()
    const [assignToClass] = useAssignToClassMutation()
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedClass, setSelectedClass] = useState("");

    const [editModalOpen, setEditModalOpen] = useState(false);
const [editingStudent, setEditingStudent] = useState(null);


    const handleSoftDelete = async (id) => {
      const result = await confirm('Are you sure? You want to delete this student')
      if (result) {
        try {
          await softDeleteStudent(id).unwrap()
          dispatch(showAlert({
            show: true,
            title: "Success",
            type: "success",
            message: "Student deleted successfully.",
          }))
          refetch()
        } catch (error) {
          dispatch(showAlert({
            show: true,
            title: "Error",
            type: "danger",
            message: "Failed to delete student.",
          }))
        }
      }
    }

    const handleRestore = async (id) => {
      const result = confirm('Are you sure? You want to restore this student')
      if (result) {
        try {
          await restoreStudent(id).unwrap()
          dispatch(showAlert({
            show: true,
            title: "Success",
            type: "success",
            message: "Student restored successfully.",
          }))
          refetch()
        } catch (error) {
          dispatch(showAlert({
            show: true,
            title: "Error",
            type: "danger",
            message: "Failed to restore student.",
          }))
        }
      }
    }

    const handleAssignToClass = async (e) => {
      e.preventDefault()
      console.log(selectedStudentId, selectedClass);
      
      const resp = await assignToClass({studentId:selectedStudentId,classId:selectedClass});
      console.log(resp);
      
    }


    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
      <>
      <EditStudentModal
  show={editModalOpen}
  handleClose={() => {
    setEditModalOpen(false);
    setEditingStudent(null);
    refetch(); // refetch after closing
  }}
  student={editingStudent}
/>

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

        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h1>Students</h1>
            <h5>
              Total - <Badge bg="secondary">{students?.length}</Badge>
            </h5>
          </div>
          <AddStudentModal />
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Enroll Date</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr
                className={student.deleted ? 'table-danger text-muted' : ''}
                key={student.id}
              >
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{DateHelper.formatYMD(student.enrollDate)}</td>
                <td className="d-flex gap-2">
                  <Button
  variant="primary"
  size="sm"
  disabled={student.deleted}
  onClick={() => {
    
    setEditingStudent(student);
    setEditModalOpen(true);
  }}
>
  <i className="bx bxs-edit"></i>
</Button>

                  <Button
                    variant="warning"
                    size="sm"
                    disabled={student.deleted}
                    onClick={() => {
                      dispatch(setOpenModal(true))
                      setSelectedStudentId(student.id)
                    }}
                  >
                    <i className="bx bx-plus-circle text-white"></i>
                  </Button>
                  <Link to={`${student.id}`}>
                    <Button variant="success" size="sm" disabled={student.deleted}>
                      <i className="bx bxs-detail"></i>
                    </Button>
                  </Link>
                  {student.deleted ? (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleRestore(student.id)}
                    >
                      <i className="bx bx-rotate-right"></i>
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleSoftDelete(student.id)}
                    >
                      <i className="bx bxs-trash"></i>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    )
  }
