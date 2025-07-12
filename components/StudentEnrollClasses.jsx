import React from 'react'
import { Card, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom';

export default function StudentEnrollClasses({data}) {
    console.log(data);
    
    
  return (
    <div>
      <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Class</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((cls, idx) => (
                <tr key={idx}>
                  <td>{cls.id}</td>
                  <td>{cls.name}</td>
                  <td>
                    <Link to={`/admin/class/${cls.id}`}>
                        <button className="btn btn-primary btn-sm">
                            View
                        </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
    </div>
  )
}
