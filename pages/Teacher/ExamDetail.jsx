import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ExamDetailPage = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      const response = await axios.get(`http://localhost:8080/exams/${id}`);
      setExam(response.data);
    };
    fetchExam();
  }, [id]);

  return (
    <div className="p-4">
      <h3>Exam Details</h3>
      {exam ? (
        <div>
          <h5>Title:{exam.title}</h5>
          <h5>Description: {exam.description}</h5>
          <h5>Duration: {exam.duration} min</h5>
          <h5>Score:{exam.score}</h5>
          <h5 className="mt-4">Questions:</h5>
          {exam.questions && exam.questions.length > 0 ? (
            exam.questions.map((q, index) => (
              <div key={index} className="card my-3 shadow-sm">
                <div className="card-body">
                  <h6>
                    <strong>Q{index + 1}:</strong> {q.questionText}
                  </h6>
                  <div className="mt-2">
                    {q.options.map((option, optIndex) => (
                      <div key={optIndex} className="form-check">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          className="form-check-input"
                          disabled
                        />
                        <label className="form-check-label">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No questions found.</p>
          )}
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/teacher/exams")}
          >
            Back
          </button>
        </div>
      ) : (
        <p>Loading exam details...</p>
      )}
    </div>
  );
};

export default ExamDetailPage;
