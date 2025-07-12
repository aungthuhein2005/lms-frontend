  import React, { useState } from 'react'
import { Button, Table, Badge, Form, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'



  export default function Students() {
    const { data: students, isLoading, error, refetch } = useGetStudentsQuery()
    const {data: classes} = useGetClassesQuery();
    const dispatch = useDispatch()
    const [softDeleteStudent] = useSoftDeleteStudentMutation()
    const [restoreStudent] = useRestoreStudentMutation()
    const [assignToClass] = useAssignToClassMutation()
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [enrollDate, setEnrollDate] = useState(DateHelper.formatYMD(new Date()));

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
      
      const resp = await assignToClass({studentId:selectedStudentId,classId:selectedClass, enrolled_at: enrollDate}).unwrap();
      console.log(resp);
      
    }


    if (isLoading) return <Loading/>
    if (error) return <ErrorMessage message={error.message} />
    return (
 <div className="container py-5">
      {/* Edit Modal */}
      <EditStudentModal
        show={editModalOpen}
        handleClose={() => {
          setEditModalOpen(false);
          setEditingStudent(null);
          refetch();
        }}
        student={editingStudent}
      />

      {/* Assign Modal */}
      <AssignModal>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicClass">
            <Form.Label>Class</Form.Label>
            <Form.Select
              aria-label="Select class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(Number(e.target.value))}
            >
              <option>Select class to assign</option>
              {classes?.map((clas) => (
                <option key={clas.id} value={clas.id}>
                  {clas.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEnrollDate">
            <Form.Label>Enrolled At</Form.Label>
            <Form.Control
              type="date"
              value={enrollDate}
              onChange={(e) => setEnrollDate(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={(e) => handleAssignToClass(e)}>
            Assign
          </Button>
        </Form>
      </AssignModal>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="fw-bold">Students</h3>
          <p className="text-muted">
            Total - <Badge bg="secondary">{students?.length}</Badge>
          </p>
        </div>
        <AddStudentModal />
      </div>

      {/* Table Card */}
      <Card className="shadow-sm rounded-4">
        <Card.Body>
          <Table hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Enroll Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className={student.deleted ? 'table-danger text-muted' : ''}
                >
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{DateHelper.formatYMD(student.enrollDate)}</td>
                  <td className="text-end d-flex justify-content-end gap-2">
                    {!student.deleted && (
                      <>
                        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="rounded-circle"
                            onClick={() => {
                              setEditingStudent(student);
                              setEditModalOpen(true);
                            }}
                          >
                            <i className="bx bxs-edit"></i>
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger overlay={<Tooltip>Assign to Class</Tooltip>}>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="rounded-circle"
                            onClick={() => {
                              dispatch(setOpenModal(true));
                              setSelectedStudentId(student.id);
                            }}
                          >
                            <i className="bx bx-plus-circle"></i>
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger overlay={<Tooltip>View Details</Tooltip>}>
                          <Link to={`${student.id}`}>
                            <Button variant="outline-success" size="sm" className="rounded-circle">
                              <i className="bx bxs-detail"></i>
                            </Button>
                          </Link>
                        </OverlayTrigger>
                      </>
                    )}

                    {student.deleted ? (
                      <OverlayTrigger overlay={<Tooltip>Restore</Tooltip>}>
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => handleRestore(student.id)}
                        >
                          <i className="bx bx-rotate-right"></i>
                        </Button>
                      </OverlayTrigger>
                    ) : (
                      <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => handleSoftDelete(student.id)}
                        >
                          <i className="bx bxs-trash"></i>
                        </Button>
                      </OverlayTrigger>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
    )
  }
