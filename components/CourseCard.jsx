import React from 'react'
import { Button, Card } from 'react-bootstrap'

export default function CourseCard({title,description}) {
  return (
     <Card style={{ width: '18rem' }} className='p-0'>
      <Card.Img variant="top" src="https://placehold.co/600x300" />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className='text-muted'>
            {description}
        </Card.Text>
        <Button variant="primary">View</Button>
      </Card.Body>
    </Card>
  )
}
