import React, { useState } from 'react'
import { Badge, Button, Dropdown, Table } from 'react-bootstrap'
import { data, Link } from 'react-router-dom'
import AssignModal from '../../components/AssignModal'
import StudentCreate from './StudentCreate'
import { useDispatch } from 'react-redux'
import { setOpenModal } from '../../features/ui/uiSlice'
import { useGetStudentsQuery } from '../../features/api/apiSlice'
import AddStudentModal from '../../components/AddStudentModal'
import axios from 'axios'

export default function Students() {

 const { data: students, isLoading, error,refetch } = useGetStudentsQuery()
 

 const handleSoftDelete = async (id) => {
 const result = confirm('Are you sure? You want to delete this student')
  if(result){
       const resp = await axios.patch(`http://localhost:8080/students/soft_delete/${id}`)
  refetch()
  }
 }

  const handleRestore = async (id) => {
    const result = confirm('Are you sure? You want to restore this student')
 if(result){
   const resp = await axios.patch(`http://localhost:8080/students/restore/${id}`)
  refetch()
 }
 }

    if (isLoading) return <p>Loading...</p>;  // Display a loading message or spinner
    if (error) return <p>Error: {error.message}</p>;  // Handle any errors

    


  return (
    <>
      <div className='d-flex  align-items-center justify-content-between mb-3'>
      <div>
      <h1>Students</h1>
      <h5>Total - <Badge bg="secondary">{students?.length}</Badge></h5>
    </div>
      <AddStudentModal/>
    </div>
    <div>
       <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {!isLoading && students.map((student)=>(
          <tr className={student.deleted ? 'table-danger text-muted' : ''}>
          <td>{student.id}</td>
          <td>{student.name}</td>
          <td>{student.gender}</td>
          <td>{student.email}</td>
          <td>{student.phone}</td>
          <td>{student.address}</td>
          <td className='d-flex gap-2'>
                      <Button variant="primary" size="sm" disabled={student.deleted}><i className='bx bxs-edit'></i></Button>
                      <Link to={`${student.id}`}><Button variant="success" size="sm" disabled={student.deleted}><i class='bx bxs-detail' ></i></Button></Link>
                      {student.deleted 
                      ? <Button variant="success" size="sm"  onClick={()=>handleRestore(student.id)}><i class='bx bx-rotate-right'></i></Button> 
                      : 
                      <Button variant="danger" size="sm"  onClick={()=>handleSoftDelete(student.id)}><i className='bx bxs-trash'></i></Button>}
                    </td>
        </tr>
        ))}
      </tbody>
    </Table>
    </div>
    </>
  )
}
