import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Exam = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  async function fetchExams() {
    await axios
      .get(`http://localhost:8080/exams/all`)
      .then((response) => setExams(response.data));
  }

  const deleteExam = async (id) => {
    await axios.delete(`http://localhost:8080/exams/${id}`);
    fetchExams();
  };

  return (
    <>
      <div className="p-4">
        <div className="d-flex justify-content-between mb-4">
          <h3>Manage Exams</h3>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/teacher/exams/create")}
          >
            <i className="bx bx-message-square-add"></i> Add Exam
          </button>
        </div>
        <div className="d-flex flex-wrap">
          {exams.map((exam) => (
            <div
              className="card"
              key={exam.id}
              style={{ width: "18rem", margin: "0 1rem 2rem 1rem" }}
            >
              <div className="card-body">
                <h5 className="card-title">{exam.title}</h5>
                <p className="card-text">
                  <strong>Description:</strong> {exam.description} <br />
                  <strong>Duration:</strong> {exam.duration} min <br />
                  <strong>Score:</strong> {exam.score}
                </p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/teacher/exams/edit/${exam.id}`)}
                  >
                    <i className="bx bxs-edit-alt"></i>
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      navigate(`/teacher/exams/${exam.id}/details`)
                    }
                  >
                    <i className="bx bx-detail"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteExam(exam.id)}
                  >
                    <i className="bx bxs-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Exam;