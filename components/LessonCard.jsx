import React, { useState, useEffect, useRef } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const LessonCard = ({
  lessonItem,
  editStatus,
  eLesson,
  setELesson,
  updateLesson,
  deleteLesson,
  editLesson,
  moduleId,
}) => {
  // Local state to store preview URL for the selected file
  const [previewURL, setPreviewURL] = useState(null);
  const fileInputRef = useRef(null);

  // Update preview if eLesson.mediaFile (File object) changes
  useEffect(() => {
    if (eLesson.mediaFile) {
      const objectUrl = URL.createObjectURL(eLesson.mediaFile);
      setPreviewURL(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else if (eLesson.mediaURL) {
      // If only URL string exists (existing media), show that
      setPreviewURL(`http://localhost:8080${eLesson.mediaURL}`);
    } else {
      setPreviewURL(null);
    }
  }, [eLesson.mediaFile, eLesson.mediaURL]);

  // Handle dropped file
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setELesson({ ...eLesson, mediaFile: file, mediaURL: "", mediaType: file.type });
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle manual file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setELesson({ ...eLesson, mediaFile: file, mediaURL: "", mediaType: file.type });
    }
  };

  return editStatus && lessonItem.id === eLesson.id ? (
    <Card key={lessonItem.id} className="mb-3">
      <Card.Body>
        <input
          type="text"
          className="form-control mb-2"
          value={eLesson.title}
          onChange={(e) => setELesson({ ...eLesson, title: e.target.value })}
          placeholder="Lesson Title"
        />
        <input
          type="text"
          className="form-control mb-3"
          value={eLesson.description}
          onChange={(e) => setELesson({ ...eLesson, description: e.target.value })}
          placeholder="Lesson Description"
        />

        {/* Drag and drop box */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
          style={{
            border: "2px dashed #aaa",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            marginBottom: "15px",
          }}
          title="Drag and drop a media file here, or click to select"
        >
          {previewURL ? (
            <>
              {eLesson.mediaType?.startsWith("image/") ? (
                <img
                  src={previewURL}
                  alt="Preview"
                  style={{ maxWidth: "150px", maxHeight: "150px", objectFit: "contain" }}
                />
              ) : eLesson.mediaType?.startsWith("video/") ? (
                <video width="150" height="150" controls>
                  <source src={previewURL} type={eLesson.mediaType} />
                </video>
              ) : eLesson.mediaType === "application/pdf" ? (
                <div className="d-flex align-items-center justify-content-center text-danger">
                  <i className="bx bxs-file-pdf bx-lg me-2"></i>
                  <span>PDF File Selected</span>
                </div>
              ) : eLesson.mediaType === "text/plain" ? (
                <div className="d-flex align-items-center justify-content-center text-muted">
                  <i className="bx bxs-file-txt bx-lg me-2"></i>
                  <span>Text File Selected</span>
                </div>
              ) : (
                <span>File selected: {eLesson.mediaFile?.name || eLesson.mediaURL}</span>
              )}
            </>
          ) : (
            <span>Drag and drop a media file here, or click to select</span>
          )}
          <input
            type="file"
            accept="image/*,video/*,application/pdf,text/plain"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <div className="d-flex justify-content-end">
          <Button variant="success" className="me-2" onClick={() => updateLesson(lessonItem.id, eLesson)}>
            <i className="bx bx-save"></i>
          </Button>
          <Button variant="danger" onClick={() => deleteLesson(lessonItem.id, moduleId)}>
            <i className="bx bxs-trash"></i>
          </Button>
        </div>
      </Card.Body>
    </Card>
  ) : (
    <Card key={lessonItem.id} className="mb-3">
      <Card.Body>
        <Card.Title>{lessonItem.title}</Card.Title>
        <Card.Text>{lessonItem.description}</Card.Text>
        <Card.Text>
          Media:{" "}
          {lessonItem.mediaType?.startsWith("image/") ? (
            <img
              src={`http://localhost:8080${lessonItem.mediaURL}`}
              alt="Preview"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          ) : lessonItem.mediaType?.startsWith("video/") ? (
            <video width="100" height="100" controls>
              <source src={`http://localhost:8080${lessonItem.mediaURL}`} type={lessonItem.mediaType} />
            </video>
          ) : lessonItem.mediaType === "application/pdf" ? (
            <div className="d-flex align-items-center text-danger">
              <i className="bx bxs-file-pdf bx-md me-2"></i>
              <a href={`http://localhost:8080${lessonItem.mediaURL}`} target="_blank" rel="noopener noreferrer">
                PDF File
              </a>
            </div>
          ) : lessonItem.mediaType === "text/plain" ? (
            <div className="d-flex align-items-center text-muted">
              <i className="bx bxs-file-txt bx-md me-2"></i>
              <a href={`http://localhost:8080${lessonItem.mediaURL}`} target="_blank" rel="noopener noreferrer">
                Text File
              </a>
            </div>
          ) : (
            "No media"
          )}
        </Card.Text>

        <div className="d-flex justify-content-end">
          <Button variant="outline-success" className="me-2">
            <Link to={`/teacher/lessons/${lessonItem.id}/assignments`} className="text-decoration-none text-success">
              <i className="bx bx-task"></i> Assignments
            </Link>
          </Button>
          <Button variant="outline-primary" className="me-2" onClick={() => editLesson(lessonItem)}>
            <i className="bx bxs-edit-alt"></i>
          </Button>
          <Button variant="outline-danger" onClick={() => deleteLesson(lessonItem.id, moduleId)}>
            <i className="bx bxs-trash"></i>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LessonCard;
