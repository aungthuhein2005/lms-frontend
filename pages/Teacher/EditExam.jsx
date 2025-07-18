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
    score: 0,
  });

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/exams/${id}`);
        setExam({
          title: response.data.title,
          description: response.data.description,
          duration: response.data.duration,
          score: response.data.score,
        });
        setSelectedClassId(response.data.classId);

        const fetchedQuestions = response.data.questions.map((q) => ({
          ...q,
          options: q.options || [],
        }));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/class/all");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchExam();
    fetchClasses();
  }, [id]);

  const handleInputChange = (e) => {
    setExam({
      ...exam,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const newQuestions = [...questions];
    newQuestions[index][name] =
      name === "correctAnswer" ? parseInt(value) : value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    const updatedExam = { ...exam, questions, classId: selectedClassId };

    try {
      await axios.put(`http://localhost:8080/exams/update/${id}`, updatedExam);
      navigate("/teacher/exams");
    } catch (error) {
      console.error("Error updating exam:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Exam</h2>
      <form onSubmit={handleUpdateExam}>
        <div className="form-group mb-2">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={exam.title}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group mb-2">
          <label>Description</label>
          <textarea
            name="description"
            value={exam.description}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group mb-2">
          <label>Duration</label>
          <input
            type="text"
            name="duration"
            value={exam.duration}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group mb-2">
          <label>Score</label>
          <input
            type="number"
            name="score"
            value={exam.score}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group mb-2">
          <label>Class</label>
          <select
            className="form-control"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            required
          >
            <option value="" disabled hidden></option>
            {classes.map((classes) => (
              <option key={classes.id} value={classes.id}>
                {classes.name}
              </option>
            ))}
          </select>
        </div>

        <h4>Questions</h4>
        {questions.map((question, index) => (
          <div key={index} className="card mb-2 p-2">
            <div className="form-group mb-2">
              <label>Question Text</label>
              <input
                type="text"
                name="questionText"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, e)}
                className="form-control"
              />
            </div>
            <div className="form-group mb-2">
              <label>Correct Answer</label>
              <select
                name="correctAnswer"
                value={question.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(index, {
                    target: {
                      name: "correctAnswer",
                      value: parseInt(e.target.value),
                    },
                  })
                }
                className="form-control"
              >
                <option value="" disabled hidden>
                  Select Correct Option
                </option>
                {question.options.map((opt, optIndex) => (
                  <option key={optIndex} value={optIndex}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Options</label>
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="form-group mb-2">
                  <label>Option {optIndex + 1}</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, optIndex, e)}
                    className="form-control"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="btn btn-primary mt-3"
          style={{ marginRight: "15px" }}
        >
          Update Exam
        </button>
        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate("/teacher/exams")}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default EditExam;
