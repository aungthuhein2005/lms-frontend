import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CreateExam = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [score, setScore] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);

  const [questions, setQuestions] = useState([
    { questionText: "", correctAnswer: null, options: [""] },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/classes/all")
      .then((response) => setClasses(response.data))
      .catch((error) => console.error("Error fetching classes", error));
  }, []);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", correctAnswer: "", options: [""] },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const removeOption = (qIndex, optIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter(
      (_, i) => i !== optIndex
    );
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const examData = {
      title,
      description,
      duration,
      score,
      classId,
      questions,
    };

    try {
      await axios.post(`http://localhost:8080/exams/create`, examData);
      navigate("/teacher/exams");
    } catch (error) {
      console.error("Error creating exam:", error);
    }
  };

return (
  <div className="container p-4">
    <div className="mb-4 border-bottom pb-2 d-flex justify-content-between align-items-center">
      <h2 className="fw-bold text-primary">Create New Exam</h2>
      <button
        className="btn btn-secondary"
        onClick={() => navigate("/teacher/exams")}
      >
        <i className="bx bx-arrow-back"></i> Back
      </button>
    </div>

    <form onSubmit={handleSubmit}>
      {/* Exam Info Section */}
      <div className="card shadow-sm p-4 mb-4">
        <h4 className="text-secondary mb-3">Exam Information</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Class</label>
            <select
              className="form-select"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            >
              <option value="" disabled hidden>
                Select Class
              </option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Duration (minutes)</label>
            <input
              type="number"
              className="form-control"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Score</label>
            <input
              type="number"
              className="form-control"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-secondary">Questions</h4>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={addQuestion}
        >
          <i className="bx bx-plus-circle"></i> Add Question
        </button>
      </div>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="card p-4 mb-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Question {qIndex + 1}</h5>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => removeQuestion(qIndex)}
            >
              <i className="bx bx-trash"></i> Remove
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Question Text</label>
            <input
              type="text"
              className="form-control"
              value={q.questionText}
              onChange={(e) =>
                handleQuestionChange(qIndex, "questionText", e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Options</label>
            {q.options.map((opt, optIndex) => (
              <div key={optIndex} className="d-flex align-items-center mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(qIndex, optIndex, e.target.value)
                  }
                  required
                  placeholder={`Option ${optIndex + 1}`}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeOption(qIndex, optIndex)}
                  disabled={q.options.length <= 1}
                >
                  <i className="bx bx-minus-circle"></i>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => addOption(qIndex)}
            >
              <i className="bx bx-plus"></i> Add Option
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Correct Answer</label>
            <select
              className="form-select"
              value={q.correctAnswer}
              onChange={(e) =>
                handleQuestionChange(qIndex, "correctAnswer", e.target.value)
              }
              required
            >
              <option value="" disabled>
                Select correct option
              </option>
              {q.options.map((opt, optIndex) => (
                <option key={optIndex} value={optIndex}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="submit" className="btn btn-success">
          <i className="bx bx-save"></i> Create Exam
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/teacher/exams")}
        >
          <i className="bx bx-x"></i> Cancel
        </button>
      </div>
    </form>
  </div>
);

};

export default CreateExam;