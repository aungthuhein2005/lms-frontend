import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDeleteExamMutation, useGetAllExamsQuery } from "../../features/api/examApiSlice";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import ExamCard from "../../components/ExamCard";

const Exam = () => {
  const navigate = useNavigate();
  const {data: exams, isLoading, isError} = useGetAllExamsQuery();
  
  const [deleteExam] = useDeleteExamMutation();

  if(isLoading) <Loading/>;
  if(isError) <ErrorMessage/>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Manage Exams</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/teacher/exams/create")}
        >
          <i className="bx bx-plus-medical"></i> Add Exam
        </button>
      </div>

      {exams?.length === 0 ? (
        <div className="alert alert-info">No exams available yet.</div>
      ) : (
        <div className="row g-4">
          {exams?.map((exam) => (
            <div className="col-md-6 col-lg-4" key={exam.id}>
            <ExamCard exam={exam} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Exam;
