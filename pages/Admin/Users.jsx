import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  Badge,
  OverlayTrigger,
  Tooltip,
  Card,
  Form,
  Row,
  Col,
  Dropdown,
} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import {
  useCheckDeleteUserMutation,
  useForceDeleteUserMutation,
  useGetUsersQuery,
} from '../../features/api/userApiSlice';
import { confirm } from '../../helpers/confirm';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../features/ui/alertSlice';

const roleColors = {
  ADMIN: 'danger',
  STUDENT: 'info',
  TEACHER: 'success',
};

export default function Users() {
  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [checkDeleteUser] = useCheckDeleteUserMutation();
  const [forceDeleteUser] = useForceDeleteUserMutation();

  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [roleFilter, setRoleFilter] = useState("ALL");

  const itemsPerPage = 8;

const filteredUsers = users.filter((user) => {
  const matchesSearch =
    [user.name, user.email, user.role].some((field) =>
      (field || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  const matchesRole =
    roleFilter === "ALL" || (user.role && user.role === roleFilter);
  return matchesSearch && matchesRole;
});


  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredUsers.map((u) => ({
        Name: u.name,
        Role: u.role,
        Address: u.address,
        Email: u.email,
        Phone: u.phone,
        Gender: u.gender,
        DOB: u.dob,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(data, 'users.xlsx');
  };

  const handleDelete = async (id) => {
    try {
      await checkDeleteUser(id).unwrap();
      dispatch(
        showAlert({
          show: true,
          title: 'Success',
          type: 'success',
          message: 'User deleted successfully.',
        })
      );
    } catch (err) {
      if (err.status === 409) {
        const userConfirmed = await confirm(err.data.message, 'Related Data Exists');
        if (userConfirmed) {
          try {
            await forceDeleteUser(id).unwrap();
            dispatch(
              showAlert({
                show: true,
                title: 'Success',
                type: 'success',
                message: 'User and related data deleted successfully.',
              })
            );
          } catch (forceErr) {
            dispatch(
              showAlert({
                show: true,
                title: 'Error',
                type: 'danger',
                message: 'Error deleting user and related data.',
              })
            );
          }
        }
      } else {
        dispatch(
          showAlert({
            show: true,
            title: 'Error',
            type: 'danger',
            message: 'Error deleting user.',
          })
        );
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2  className="fw-bold text-primary">User Management</h2>
        <Button
          variant="primary"
          className="d-flex align-items-center gap-2 shadow-sm"
          href="/admin/users/create"
        >
          <i className="bx bx-plus-circle fs-5"></i> Add User
        </Button>
      </div>

      <Card className="rounded-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                placeholder="🔍 Search name, email, role"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
              />
            </Col>
            <Col md={6} className=" d-flex justify-content-end">
              <Button variant="success" onClick={exportToExcel}>
                Export Excel
              </Button>
               <Dropdown>
      <Dropdown.Toggle variant="secondary" className="ms-2">
        <i className="bx bx-filter-alt"></i> Filter
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => setRoleFilter("ADMIN")}>Admin</Dropdown.Item>
        <Dropdown.Item onClick={() => setRoleFilter("TEACHER")}>Teacher</Dropdown.Item>
        <Dropdown.Item onClick={() => setRoleFilter("STUDENT")}>Student</Dropdown.Item>
        <Dropdown.Item onClick={() => setRoleFilter("ALL")}>All Users</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
            </Col>
          </Row>

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
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1 + currentPage * itemsPerPage}</td>
                    <td>{user.name}</td>
                    <td>
                      <Badge
                        bg={
                          user.role
                            ? roleColors[user.role] || 'primary'
                            : 'secondary'
                        }
                      >
                        {user.role
                          ? user.role.charAt(0).toUpperCase() +
                            user.role.slice(1).toLowerCase()
                          : 'Not Assigned'}
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

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <ReactPaginate
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName="pagination"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              activeClassName="active"
              previousLabel="«"
              nextLabel="»"
              previousClassName="page-item"
              nextClassName="page-item"
              previousLinkClassName="page-link"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              forcePage={currentPage}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
