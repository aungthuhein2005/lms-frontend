import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Table,Button, Badge} from 'react-bootstrap';
import { useCheckDeleteUserMutation, useForceDeleteUserMutation, useGetUsersQuery } from '../../features/api/userApiSlice';
import { confirm } from '../../helpers/confirm';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../features/ui/alertSlice';

const roleColors = {
  ADMIN: "danger",    // red
  STUDENT: "info",    // blue
  TEACHER: "success", // green
};

export default function Users() {
const { data: users = [], isLoading, error } = useGetUsersQuery();
const [checkDeleteUser, { isLoading: isDeleting }] = useCheckDeleteUserMutation();
const [forceDeleteUser] = useForceDeleteUserMutation();

const dispatch = useDispatch();

const handleDelete = async (id) => {
  try {
    await checkDeleteUser(id).unwrap();
    dispatch(showAlert({
      show: true,
      title: "Success",
      type: "success",
      message: "User deleted successfully.",
    })
    )
  } catch (err) {
    if (err.status === 409) {
      const userConfirmed = await confirm(err.data.message, "Related Data Exists");
      if (userConfirmed) {
        try {
          await forceDeleteUser(id).unwrap();
          dispatch(showAlert({
            show: true,
            title: "Success",
            type: "success",
            message: "User and related data deleted successfully.",
          }));
        } catch (forceErr) {
          dispatch(showAlert({
            show: true,
            title: "Error",
            type: "danger",
            message: "Error deleting user and related data.",
          }));
        }
      }
    } else {
      dispatch(showAlert({
        show: true,
        title: "Error",
        type: "danger",
        message: "Error deleting user.",
      }));
    }
  }
};




  return (
    <div className="container mt-5">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="mb-4">Users</h1>
      <Button variant="primary" className='d-flex align-items-center gap-2' href="/admin/users/create">
        <i className='bx bx-plus-circle' style={{fontSize:24}}></i>Add User
      </Button>
    </div>
       <Table striped bordered hover>
        <thead className="table">
          <tr>
            <th>#</th>  
            <th>Name</th>
            <th>Role</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Profile</th>
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
                <td>{user.name}</td>
                 <td className=''>
                  <Badge bg={user.role ? roleColors[user.role] || "primary" : "secondary"}>
    {user.role
      ? user.role.charAt(0) + user.role.slice(1).toLowerCase()  // Capitalize first letter only
      : "Not Assigned"}
  </Badge>
                 </td>
                <td>{user.address}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.profile}</td>
                <td>{user.role}</td>
                <td>{user.gender}</td>
                <td>{user.dob}</td>
                <td className='d-flex'>
                  {/* <Button variant="success" size="sm" className="me-2" onClick={() => handleEdit(user)}>
                    <i className='bx bxs-edit-alt'></i>
                  </Button> */}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
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

