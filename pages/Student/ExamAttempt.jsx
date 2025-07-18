import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ExamAttempt = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const studentId = 1;

  useEffect(() => {
    const fetchExam = async () => {
      const response = await axios.get(`http://localhost:8080/exams/${id}`);
      setExam(response.data);
    };
    fetchExam();
  }, [id]);

  const handleOptionChange = (questionId, selectedOptionIndex) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOptionIndex,
    }));
  };

  const handleSubmit = async () => {
    const answerDTOs = Object.entries(selectedAnswers).map(
      ([questionId, selectedOptionIndex]) => ({
        questionId: parseInt(questionId),
        selectedOptionIndex,
      })
    );

    try {
      const response = await axios.post(
        `http://localhost:8080/exams/${id}/submit/${studentId}`,
        answerDTOs
      );
      navigate(`/student/exam/${id}/result`);
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  return (
    <div className="p-4">
      {exam ? (
        <div>
          <h5 className="mt-4">{exam.title} : </h5>
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
                          value={optIndex}
                          checked={selectedAnswers[q.id] === optIndex}
                          onChange={() => handleOptionChange(q.id, optIndex)}
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
            <p>No questions found.</p>
          )}

          <button
            type="submit"
            className="btn btn-success mt-3"
            style={{ marginRight: "15px" }}
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/student/exams")}
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

export default ExamAttempt;
