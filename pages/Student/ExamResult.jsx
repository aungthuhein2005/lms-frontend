import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ExamResultPage = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/exams/${id}/result`
        );
        setResult(response.data);
      } catch (error) {
        console.error("Failed to load result:", error);
      }
    };

    fetchResult();
  }, [id]);

  if (!result) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="text-primary fw-bold">Exam Results</h2>
        <p className="fs-4">
          <span className="badge bg-success">
            Score: {result.correctAnswers} / {result.totalQuestions}
          </span>
        </p>
      </div>

      <div className="row g-4">
        {result.submittedAnswers.map((answer, index) => {
          const isCorrect = answer.selectedOption === answer.correctAnswer;
          return (
            <div key={index} className="col-md-12">
              <div
                className={`card shadow-sm ${
                  isCorrect ? "border-success" : "border-danger"
                }`}
              >
                <div className="card-body">
                  <h5 className="card-title">
                    Question {index + 1}
                  </h5>
                  <p className="card-text">{answer.questionText}</p>
                  <p>
                    Your Answer:{" "}
                    <span className={isCorrect ? "text-success" : "text-danger"}>
                      {answer.selectedOption || "No Answer Selected"}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-success">
                      Correct Answer: {answer.correctAnswer}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-5">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/student/exams")}
        >
          Back to Exams
        </button>
      </div>
    </div>
  );
};

export default ExamResultPage;
