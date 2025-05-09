import React from 'react'
import { useParams } from 'react-router-dom'

export default function StudentDetail() {

    const {id} = useParams();

  return (
    <div>
      Student Detail {id}
    </div>
  )
}
