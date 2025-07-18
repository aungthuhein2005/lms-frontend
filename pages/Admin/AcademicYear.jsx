import React, { useState, useEffect } from "react";
import { useAddAcademicYearMutation, useDeleteAcademicYearMutation, useGetAcademicYearsQuery, useUpdateAcademicYearMutation } from "../../features/api/academicYearApiSlice";
import { Table, Button, Modal, Form, OverlayTrigger, Tooltip, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { showAlert } from '../../features/ui/alertSlice'
import { confirm } from "../../helpers/confirm";
import Loading from "../../components/Loading";
import { Row, Col } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ReactPaginate from 'react-paginate';
import ErrorMessage from '../../components/ErrorMessage'; // if you use this for error display


export default function AcademicYear() {
  const { data: academicYears, isLoading, error } = useGetAcademicYearsQuery();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [createAcademicYear] = useAddAcademicYearMutation();
  const [updateAcademicYear] = useUpdateAcademicYearMutation();
  const [deleteAcademicYear] = useDeleteAcademicYearMutation();
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [currentPage, setCurrentPage] = useState(0);
const itemsPerPage = 8;

const filteredAcademicYears = academicYears?.filter((year) => {
  const matchName = year.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchFromDate = fromDate ? new Date(year.startDate) >= new Date(fromDate) : true;
  const matchToDate = toDate ? new Date(year.endDate) <= new Date(toDate) : true;
  return matchName && matchFromDate && matchToDate;
}) || [];

const pageCount = Math.ceil(filteredAcademicYears.length / itemsPerPage);

const paginatedYears = filteredAcademicYears.slice(
  currentPage * itemsPerPage,
  (currentPage + 1) * itemsPerPage
);

const handlePageChange = ({ selected }) => {
  setCurrentPage(selected);
};

const resetFilters = () => {
  setSearchTerm("");
  setFromDate("");
  setToDate("");
  setCurrentPage(0);
};

const exportToExcel = () => {
  const exportData = filteredAcademicYears.map((year) => ({
    ID: year.id,
    Name: year.name,
    "Start Date": year.startDate,
    "End Date": year.endDate,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Academic Years");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "academic_years.xlsx");
};


  const openModal = (year = null) => {
    if (year) {
      setIsEditMode(true);
      setSelectedId(year.id);
      setFormData({
        name: year.name,
        startDate: formatDateForInput(year.startDate),
        endDate: formatDateForInput(year.endDate),
      });
    } else {
      setIsEditMode(false);
      setSelectedId(null);
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
      });
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    const result = await confirm('Are you sure? You want to delete this academic year');
    if(result){
      deleteAcademicYear(id).unwrap()
      .then(() => {
        dispatch(showAlert({
          type: "success",
          message: "Academic year deleted successfully",
          title: "Success",
        }));
      })
      .catch((err) => {
        dispatch(showAlert({
          type: "error",
          message: "Failed to delete academic year: " + err.message,
          title: "Error",
        }));
      });
    }
  }

  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    if (isEditMode) {
      console.log("Update academic year:", selectedId, payload);
      // Call update mutation
      updateAcademicYear({ id: selectedId, ...payload })
        .unwrap()
        .then(() => {
          dispatch(showAlert({
            type: "success",
            message: "Academic year updated successfully",
            title: "Success",
          }))
        })
        .catch((err) => {
          dispatch(showAlert({
            type: "error",
            message: "Failed to update academic year: " + err.message,
            title: "Error",
          }));
        });
    } else {
      console.log("Create academic year:", payload);
      // Call create mutation
      createAcademicYear(payload)
        .unwrap()
        .then(() => {
          dispatch(showAlert({
            type: "success",
            message: "Academic year created successfully",
            title: "Success",
          }));
        })
        .catch((err) => {
          dispatch(showAlert({
            type: "error",
            message: "Failed to create academic year: " + err.message,
            title: "Error",
          }));
        });
    }

    handleClose();
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
 <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2  className="fw-bold text-primary">Academic Years</h2>
        <Button variant="primary" onClick={() => openModal()}>
          <i className="bx bx-plus me-2"></i>New Academic Year
        </Button>
      </div>
      {/* Table in Card */}
      <Card className="shadow-sm rounded-4">
        <Card.Body>
           <Row className="mb-3 align-items-end">
                      <Col md={4}>
                        <Form.Control
                          placeholder="🔍 Search by name"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(0);
                          }}
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Label>From</Form.Label>
                        <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                      </Col>
                      <Col md={2}>
                        <Form.Label>To</Form.Label>
                        <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                      </Col>
                      <Col md={1} className="text-end">
                        <Button variant="secondary" onClick={resetFilters}>Reset</Button>
                      </Col>
                      <Col md={3} className="text-end">
                        <Button variant="success" onClick={exportToExcel}>Export Excel</Button>
                      </Col>
                    </Row>
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                paginatedYears.length === 0 ? (
                   <tr><td colSpan="5" className="text-center py-4">No Academic Year found.</td></tr>
                ) : (
                  paginatedYears?.map((year) => (
                    <tr key={year.id}>
                      <td>{year.id}</td>
                      <td>{year.name}</td>
                      <td>{year.startDate}</td>
                      <td>{year.endDate}</td>
                      <td className="text-end d-flex justify-content-end gap-2">
                        <OverlayTrigger overlay={<Tooltip>Details</Tooltip>}>
                          <Link to={`${year.id}`}>
                            <Button variant="outline-primary" size="sm" className="rounded-circle">
                              <i className="bx bxs-detail"></i>
                            </Button>
                          </Link>
                        </OverlayTrigger>
                        <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                          <Button variant="outline-warning" size="sm" className="rounded-circle" onClick={() => openModal(year)}>
                            <i className="bx bxs-edit-alt"></i>
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                          <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => handleDelete(year.id)}>
                            <i className="bx bxs-trash"></i>
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))
                )
              }
            </tbody>
          </Table>
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

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit Academic Year" : "New Academic Year"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. 2024-2025"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditMode ? "Update" : "Create"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
