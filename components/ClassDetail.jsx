import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ClassDetail=()=>{

  const {id} = useParams();
  const [classData, setClassData] = useState();

  useEffect(()=>{
    axios.get(`http://localhost:8080/classes/${id}`)
      .then((response) => {
        setClassData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching class data:", error);
      });
  })
  
    return(
        <>
         <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Class Info</h2>
      <div className="mb-4">
        <p><strong>ID:</strong> {classData?.id}</p>
        <p><strong>Name:</strong> {classData?.name}</p>
        <p><strong>Description:</strong> {classData?.description}</p>
        <p><strong>Schedule:</strong> {classData?.schedule}</p>
          </div>
      </div>
        </>
    )
}

export default ClassDetail;