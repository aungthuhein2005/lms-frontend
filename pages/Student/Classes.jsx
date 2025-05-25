import React from 'react'
import CourseCard from '../../components/CourseCard'
import { useGetAssignedClassesQuery } from '../../features/api/studentApiSlice';
import { useGetClassesQuery } from '../../features/api/classApiSlice';

export default function Classes() {

  const { data: classes = [] } = useGetClassesQuery();
  console.log(classes);
  

  return (
    <div>
        <h1>My Classes</h1>
        <div className='container mt-4'>
          <div className="row gap-3">
            {classes.map(item => (
            <CourseCard title={item.name} description={item.description} />
          ))}
          </div>
        </div>
    </div>
  )
}
