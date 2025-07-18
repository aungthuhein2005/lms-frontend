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
      .get("http://localhost:8080/class/all")
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
      <h3>Create New Exam</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title:</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Duration (minutes):</label>
          <input
            type="number"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Score:</label>
          <input
            type="number"
            className="form-control"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label> Class :</label>
          <select
            className="form-control"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              {" "}
              Select Class
            </option>
            {classes.map((classes) => (
              <option key={classes.id} value={classes.id}>
                {classes.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={addQuestion}
        >
          <i className="bx bx-message-square-add"></i> Add Question
        </button>
        <h5>Questions</h5>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="card p-3 my-3 shadow-sm">
            <div className="mb-2">
              <label>Question Text:</label>
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

            <div className="mb-2">
              <label>Options:</label>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="d-flex align-items-center mb-1">
                  <input
                    type="text"
                    className="form-control me-2"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                    placeholder={`Option ${optIndex + 1}`}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeOption(qIndex, optIndex)}
                    disabled={q.options.length <= 1}
                  >
                    <i className="bx  bx-minus"></i>
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary btn-sm mt-1"
                onClick={() => addOption(qIndex)}
              >
                <i className="bx bx-message-square-add"></i> Add Option
              </button>
            </div>

            <div className="mb-2">
              <label>Correct Answer:</label>
              <select
                className="form-control"
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

            <button
              type="button"
              className="btn btn-danger btn-sm mt-2"
              onClick={() => removeQuestion(qIndex)}
            >
              <i className="bx  bx-minus"></i> Remove Question
            </button>
          </div>
        ))}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">
            Create Exam
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/teacher/exams")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam;
