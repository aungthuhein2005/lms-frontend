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
        console.log("Exam Result Response:", response.data);
        setResult(response.data);
      } catch (error) {
        console.error("Failed to load result:", error);
      }
    };

    fetchResult();
  }, [id]);

  if (!result) {
    return <p>Loading result...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h3>
          <strong>Score:</strong> {result.correctAnswers} /{" "}
          {result.totalQuestions}
        </h3>
        {result.submittedAnswers.map((answer, index) => (
          <div key={index} className="card p-3 mb-3 shadow-sm">
            <p>
              <strong>Q{index + 1}:</strong> {answer.questionText}
            </p>
            <p>
              <span
                className={
                  answer.selectedOption === answer.correctAnswer
                    ? "text-success"
                    : "text-danger"
                }
              >
                {answer.selectedOption || "No Answer Selected"}
              </span>
            </p>
            <p>
              <strong>Correct Answer:</strong> {answer.correctAnswer}
            </p>
          </div>
        ))}
      </div>
      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate("/student/exams")}
      >
        Back
      </button>
    </div>
  );
};

export default ExamResultPage;
