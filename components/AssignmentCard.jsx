import React, { useState } from 'react'
import { Badge, Button, Card } from 'react-bootstrap'
import FileUploadModal from './FileUploadModal'

export default function AssignmentCard({assignment}) {

    const [showModal, setShowModal] = useState(false);

  return (
<Card>
              <Card.Body>
                <Card.Title className='d-flex'>
                    <h5>{assignment.title}</h5>
                    <Badge bg={assignment.status === 'Submitted' ? 'success' : 'warning'} className="mb-2 ms-2" >
                  {assignment.status}
                </Badge>
                </Card.Title>
                
                <Card.Body className='p-0 ps-2'>
                   <Card.Text>{assignment.description}</Card.Text>
                <p><strong>Due:</strong> {assignment.dueDate}</p>
                </Card.Body>
                
                
                {assignment.status !== 'Submitted' && (
                  <Button variant="primary" onClick={()=>setShowModal(true)} className='btn-sm'>Submit</Button>
                )}
                 <FileUploadModal show={showModal} handleClose={() => setShowModal(false)} />

              </Card.Body>
            </Card>
  )
}
