import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [exam, setExam] = useState({
    title: "",
    description: "",
    duration: "",
    score: "",
  });

  const [questions, setQuestions] = useState([
    { questionText: "", correctAnswer: null, options: [""] }, // Changed to null for initial correctAnswer
  ]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/exams/${id}`);
        const examData = response.data;
        setExam({
          title: examData.title,
          description: examData.description,
          duration: examData.duration,
          score: examData.score,
        });
        setSelectedClassId(examData.classId);

        // Ensure questions have correct structure with options array
        const fetchedQuestions = examData.questions.map((q) => ({
          questionText: q.questionText,
          // Ensure correctAnswer is parsed as an integer if it's an index
          correctAnswer: q.correctAnswer !== null ? String(q.correctAnswer) : null,
          options: q.options.length ? q.options : [""],
        }));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching exam:", error);
        // Optionally, navigate back or show an error message if exam not found
        // navigate("/teacher/exams");
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/classes/all");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchExam();
    fetchClasses();
  }, [id]); // Depend on 'id' to refetch when the exam ID changes

  const handleInputChange = (e) => {
    setExam({
      ...exam,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    // correctAnswer should be stored as a string (index) for the select input
    // and then converted to integer before sending to backend if needed.
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", correctAnswer: null, options: [""] }, // Changed to null
    ]);
  };

  const removeQuestion = (index) => {
    // Allow removing all questions if desired, or add a check like in CreateExam
    // if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, optIndex) => {
    const newQuestions = [...questions];
    // Ensure there's always at least one option
    if (newQuestions[qIndex].options.length <= 1) return;
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== optIndex);
    // If the removed option was the correct answer, reset correctAnswer
    if (newQuestions[qIndex].correctAnswer === String(optIndex)) {
        newQuestions[qIndex].correctAnswer = null;
    } else if (newQuestions[qIndex].correctAnswer > String(optIndex)) {
        // Adjust correct answer index if an earlier option was removed
        newQuestions[qIndex].correctAnswer = String(parseInt(newQuestions[qIndex].correctAnswer) - 1);
    }
    setQuestions(newQuestions);
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();

    const updatedExam = {
      ...exam,
      classId: selectedClassId,
      // Ensure correctAnswer is an integer before sending to backend
      questions: questions.map(q => ({
          ...q,
          correctAnswer: q.correctAnswer !== null ? parseInt(q.correctAnswer) : null
      })),
    };

    try {
      await axios.put(`http://localhost:8080/exams/update/${id}`, updatedExam);
      navigate("/teacher/exams");
    } catch (error) {
      console.error("Error updating exam:", error);
      // You might want to display a user-friendly error message here
    }
  };

  return (
    <div className="container p-4">
      {/* Header Section - Matched CreateExam */}
      <div className="mb-4 border-bottom pb-2 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold text-primary">Edit Exam</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/teacher/exams")}
        >
          <i className="bx bx-arrow-back"></i> Back
        </button>
      </div>

      <form onSubmit={handleUpdateExam}>
        {/* Exam Info Section - Matched CreateExam */}
        <div className="card shadow-sm p-4 mb-4">
          <h4 className="text-secondary mb-3">Exam Information</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={exam.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Class</label>
              <select
                className="form-select" // Changed to form-select for consistency
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
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
                name="duration"
                className="form-control"
                value={exam.duration}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Score</label>
              <input
                type="number"
                name="score"
                className="form-control"
                value={exam.score}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-12"> {/* Changed to col-12 for full width */}
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3" // Added rows for consistency
                value={exam.description}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Questions Section - Matched CreateExam */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-secondary">Questions</h4>
          <button
            type="button"
            className="btn btn-outline-primary" // Matched style
            onClick={addQuestion}
          >
            <i className="bx bx-plus-circle"></i> Add Question {/* Matched icon */}
          </button>
        </div>

        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="card p-4 mb-3 shadow-sm" // Matched padding and shadow
          >
            <div className="d-flex justify-content-between align-items-center mb-2"> {/* Added flex for alignment */}
              <h5 className="mb-0">Question {qIndex + 1}</h5> {/* Added Question numbering */}
              <button
                type="button"
                className="btn btn-sm btn-danger" // Matched style
                onClick={() => removeQuestion(qIndex)}
                disabled={questions.length <= 1} // Added disabled for consistency
              >
                <i className="bx bx-trash"></i> Remove {/* Matched icon */}
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
                <div key={optIndex} className="d-flex align-items-center mb-2"> {/* Matched flex and margin */}
                  <input
                    type="text"
                    className="form-control me-2" // Added me-2 for spacing
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                    required
                    placeholder={`Option ${optIndex + 1}`} // Added placeholder for consistency
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger" // Matched style
                    onClick={() => removeOption(qIndex, optIndex)}
                    disabled={q.options.length <= 1} // Matched disabled state
                  >
                    <i className="bx bx-minus-circle"></i> {/* Matched icon */}
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm" // Matched style
                onClick={() => addOption(qIndex)}
              >
                <i className="bx bx-plus"></i> Add Option {/* Matched icon */}
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label">Correct Answer</label>
              <select
                className="form-select" // Changed to form-select for consistency
                value={q.correctAnswer !== null ? q.correctAnswer : ""} // Handle null for initial selection
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
            {/* Removed duplicate "Remove Question" button here as it's already at the top */}
          </div>
        ))}

        {/* Submit Buttons - Matched CreateExam */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="submit" className="btn btn-success">
            <i className="bx bx-save"></i> Update Exam {/* Matched icon */}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/teacher/exams")}
          >
            <i className="bx bx-x"></i> Cancel {/* Matched icon */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExam;
