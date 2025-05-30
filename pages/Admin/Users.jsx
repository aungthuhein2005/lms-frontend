import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Table,Button} from 'react-bootstrap';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editStatus,setEditStatus] = useState(false)

  const fetchUsers = async() => {
    const respone = await axios.get('http://localhost:8080/users')
    console.log(respone.data)
    setUsers(respone.data)
  }

  async function deleteUser(userId)
  {
    await axios.delete(`http://localhost:8080/users/${userId}`)
    .then(response=>console.log(response.data))
    fetchUsers()
  }

  // async function createUser(editedUser) {
  //  console.log(editedUser)
  //   setEditStatus(true)
  //   setEuser(editedUser)
  // }

 useEffect (()=>{
    fetchUsers()
  },[])



  return (
    <div className="container mt-5">
      <h1 className="mb-4">Users</h1>
       <Table striped bordered hover>
        <thead className="table">
          <tr>
            <th>#</th>
            <th>School ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Profile</th>
            <th>Password</th>
            <th>Role</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="12" className="text-center">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.school_id}</td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.profile}</td>
                <td>{user.password}</td>
                <td>{user.role}</td>
                <td>{user.gender}</td>
                <td>{user.dob}</td>
                <td className='d-flex'>
                  <Button variant="success" size="sm" className="me-2" onClick={() => createUser(user)}>
                    <i className='bx bxs-edit-alt'></i>
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deleteUser(user.id)}>
                    <i className='bx bxs-trash-alt'></i>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

