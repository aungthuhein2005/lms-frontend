import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { useGetAcademicYearsQuery } from "../../features/api/academicYearApiSlice";
import { Link } from "react-router-dom";

export default function AcademicYear() {
  const { data: academicYears, isLoading, error } = useGetAcademicYearsQuery();

  const handleShow = () => {
    // TODO: implement modal logic
    console.log("Open modal");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading academic years.{error.message}</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Academic Year</h2>
        <button className="btn btn-primary" onClick={handleShow}>
          New Academic Year
        </button>
      </div>

      <h5>Total - {academicYears?.length || 0}</h5>

      <div className="mt-4">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {academicYears?.map((year) => (
              <tr key={year.id}>
                <td>{year.id}</td>
                <td>{year.name}</td>
                <td>{year.startDate}</td>
                <td>{year.endDate}</td>
                <td>
                    <Link to={`${year.id}`}><button className="btn btn-primary me-2">
                    <i className="bx bxs-detail"></i>
                  </button></Link>
                  <button className="btn btn-warning me-2">
                    <i className="bx bxs-edit-alt"></i>
                  </button>
                  <button className="btn btn-danger">
                    <i className="bx bxs-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
