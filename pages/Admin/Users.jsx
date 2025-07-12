import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Badge, OverlayTrigger, Tooltip, Card } from 'react-bootstrap';
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
console.log(users);




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
<div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">User Management</h2>
        <Button variant="primary" className="d-flex align-items-center gap-2 shadow-sm" href="/admin/users/create">
          <i className="bx bx-plus-circle fs-5"></i> Add User
        </Button>
      </div>

      <Card className=" rounded-4">
        <Card.Body>
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Role</th>
                <th>Address</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>DOB</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">No users found.</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>
                      <Badge bg={user.role ? roleColors[user.role] || "primary" : "secondary"}>
                        {user.role
                          ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
                          : "Not Assigned"}
                      </Badge>
                    </td>
                    <td>{user.address}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.gender}</td>
                    <td>{user.dob}</td>
                    <td className="text-end">
                      <OverlayTrigger overlay={<Tooltip>Delete User</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-circle"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="bx bxs-trash-alt"></i>
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

