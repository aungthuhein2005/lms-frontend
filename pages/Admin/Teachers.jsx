import React from 'react'
import { Badge, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Teachers() {
  return (
     <>
      <div className='d-flex  align-items-center justify-content-between mb-3'>
      <div>
      <h1>Teachers</h1>
      <h5>Total - <Badge bg="secondary">100</Badge></h5>
    </div>
     <Link to='/teachers/create'>
      <Button variant="primary"><i class='bx bxs-plus-circle'></i> Add Teacher</Button>
      </Link>
    </div>
    <div>
       <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td className='d-flex gap-2'>
            <Button variant="primary" size="sm"><i class='bx bxs-edit'></i></Button>
            <Button variant="danger" size="sm"><i class='bx bxs-trash'></i></Button>
            <Button variant="success" size="sm"><i class='bx bxs-detail' ></i></Button>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
          <td className='d-flex gap-2'>
            <Button variant="primary" size="sm"><i class='bx bxs-edit'></i></Button>
            <Button variant="danger" size="sm"><i class='bx bxs-trash'></i></Button>
            <Button variant="success" size="sm"><i class='bx bxs-detail' ></i></Button>
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td colSpan={2}>Larry the Bird</td>
          <td>@twitter</td>
          <td className='d-flex gap-2'>
            <Button variant="primary" size="sm"><i class='bx bxs-edit'></i></Button>
            <Button variant="danger" size="sm"><i class='bx bxs-trash'></i></Button>
            <Button variant="success" size="sm"><i class='bx bxs-detail' ></i></Button>
          </td>
        </tr>
      </tbody>
    </Table>
    </div>
    </>
  )
}
