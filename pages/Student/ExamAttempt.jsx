import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap"; // Assuming you have react-bootstrap installed
import { useGetExamByIdQuery } from "../../features/api/examApiSlice";
import { useSelector } from "react-redux";

const ExamAttempt = () => {
  const { id } = useParams();
  // const [exam, setExam] = useState(null);
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const {data:exam,isLoading,isError } = useGetExamByIdQuery(id);
  const {roleId:studentId} = useSelector(state=>state.auth.user);


  const handleOptionChange = (questionId, selectedOptionIndex) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOptionIndex,
    }));
  };

  const handleSubmit = async () => {
    // Basic validation: Ensure all questions are answered
    if (exam && exam.questions && Object.keys(selectedAnswers).length !== exam.questions.length) {
      // You might want to display a more user-friendly message here, e.g., a modal or toast
      alert("Please answer all questions before submitting.");
      return;
    }

    const answerDTOs = Object.entries(selectedAnswers).map(
      ([questionId, selectedOptionIndex]) => ({
        questionId: parseInt(questionId),
        selectedOptionIndex,
      })
    );

    try {
      await axios.post(
        `http://localhost:8080/exams/${id}/submit/${studentId}`,
        answerDTOs
      );
      navigate(`/student/exam/${id}/result`);
    } catch (err) {
      console.error("Error submitting exam:", err);
      // You might want to display a user-friendly error message here
      alert("Failed to submit exam. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading exam details...</span>
        </Spinner>
        <p className="mt-2 text-muted">Loading exam details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger text-center my-5" role="alert">
        Error
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center my-5">
        <p className="text-muted">Exam not found.</p>
        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate("/student/exams")}
        >
          <i className="bx bx-arrow-back"></i> Back to Exams
        </button>
      </div>
    );
  }

  return (
    <div className="container p-4">
      {/* Header Section - Matched CreateExam/EditExam */}
      <div className="mb-4 border-bottom pb-2 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold text-primary">Attempt Exam: {exam.title}</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/student/exams")}
        >
          <i className="bx bx-arrow-back"></i> Back
        </button>
      </div>

      {/* Exam Details Card */}
      <div className="card shadow-sm p-4 mb-4">
        <h4 className="text-secondary mb-3">Exam Information</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <p className="mb-1"><strong>Title:</strong> {exam.title}</p>
            <p className="mb-1"><strong>Duration:</strong> {exam.duration} minutes</p>
          </div>
          <div className="col-md-6">
            <p className="mb-1"><strong>Total Score:</strong> {exam.score}</p>
            <p className="mb-1"><strong>Questions:</strong> {exam.questions ? exam.questions.length : 0}</p>
          </div>
          <div className="col-12">
            <p className="mb-0"><strong>Description:</strong> {exam.description}</p>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <h4 className="text-secondary mb-3">Questions</h4>
      {exam.questions && exam.questions.length > 0 ? (
        exam.questions.map((q, index) => (
          <div key={q.id || index} className="card p-4 mb-3 shadow-sm"> {/* Use q.id if available, otherwise index */}
            <div className="card-body p-0"> {/* Remove default card-body padding */}
              <h5 className="fw-semibold mb-3">
                Q{index + 1}: {q.questionText}
              </h5>
              <div className="mt-2">
                {q.options.map((option, optIndex) => (
                  <div key={optIndex} className="form-check mb-2">
                    <input
                      type="radio"
                      name={`question-${q.id || index}`} // Use q.id for unique grouping if available
                      className="form-check-input"
                      value={optIndex}
                      checked={selectedAnswers[q.id || index] === optIndex}
                      onChange={() => handleOptionChange(q.id || index, optIndex)}
                      required
                    />
                    <label className="form-check-label">{option}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-info text-center" role="alert">
          <p className="mb-0">This exam currently has no questions.</p>
          <p className="mb-0">Please contact your teacher for more information.</p>
        </div>
      )}

      {/* Submit/Back Buttons - Matched CreateExam/EditExam */}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button" // Changed to type="button" to prevent default form submission outside of handleSubmit
          className="btn btn-success"
          onClick={handleSubmit}
        >
          <i className="bx bx-check-circle"></i> Submit Exam
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/student/exams")}
        >
          <i className="bx bx-x"></i> Cancel
        </button>
      </div>
    </div>
  );
};

export default ExamAttempt;
