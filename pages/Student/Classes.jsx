import React from 'react'
import CourseCard from '../../components/CourseCard'

export default function Classes() {

    const courses = [
        {title: 'Batch-1',descriptin: 'This is batch 1'},
        {title: 'Batch-2',descriptin: 'This is batch 2'},
        {title: 'Batch-3',descriptin: 'This is batch 3'},
    ]

  return (
    <div>
        <h1>My Classes</h1>
        <div className='container mt-4'>
          <div className="row gap-3">
            {courses.map(course=>(
            <CourseCard title={course.title} description={course.descriptin} />
          ))}
          </div>
        </div>
    </div>
  )
}
