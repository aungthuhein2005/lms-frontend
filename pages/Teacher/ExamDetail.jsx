import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ExamDetailPage = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      const response = await axios.get(`http://localhost:8080/exams/${id}`);
      setExam(response.data);
    };
    const fetchScores = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/results/exam/${id}`
        );
        setScores(response.data);
      } catch (error) {
        console.error("Error fetching student scores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
    fetchScores();
  }, [id]);

  return (
    <div className="p-4">
      {exam ? (
        <div>
          <h5 className="mt-4">{exam.title} : </h5>
          <h5 className="mt-4">{exam.description} </h5>
          <div className="container mt-4">
            <h3>Student Scores for Exam : </h3>
            <table className="table table-striped table-bordered mt-3">
              <thead className="table-dark">
                <tr>
                  <th>No</th>
                  <th>Student ID</th>
                  {/* <th>Student Name</th> */}
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {scores.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No student scores found.
                    </td>
                  </tr>
                ) : (
                  scores.map((score, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{score.studentId}</td>
                      <td>{score.score}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
