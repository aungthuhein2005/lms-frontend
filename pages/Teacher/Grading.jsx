import React from 'react'
import { Button, Card, OverlayTrigger, Table, Tooltip } from 'react-bootstrap'

export default function Grading() {
  return (
    <div className='container py-5'>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0 text-primary">Grade</h2>
        <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm" href="/admin/users/create">
          Add New
        </Button>
      </div>
      <Card className="rounded-4 p-4">
        <Table responsive hover className="mb-0 align-middle">
        <thead className="table-light">
            <tr>
                <th>#</th>
                <th>Exam Name</th>
                <th>Grade</th>
                <th>Exam Date</th>
                <th className="text-end">Actions</th>
            </tr>
        </thead>
        <tbody>
                <tr>
                    <td>1</td>
                    <td>Midterm Exam</td>
                    <td>85%</td>
                    <td>2023-10-01</td>
                    <td className="text-end">
                        <OverlayTrigger overlay={<Tooltip>View Details</Tooltip>}>
<Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-circle"
                        //   onClick={() => handleDelete(user.id)}
                        >
                          <i className="bx bxs-trash-alt"></i>
                        </Button>
                        </OverlayTrigger>
                    </td>
                </tr>
        </tbody>
      </Table>
      </Card>
    </div>
  )
}
