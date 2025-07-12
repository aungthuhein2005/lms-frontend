import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function CourseCard({title,description,classId}) {
  return (
     <Card style={{ width: '18rem' }} className='p-0'>
      <Card.Img variant="top" src="https://placehold.co/600x300" />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className='text-muted'>
            {description}
        </Card.Text>
        <Link to={`${classId}`} className="btn btn-sm btn-primary">View</Link>
      </Card.Body>
    </Card>
  )
}
