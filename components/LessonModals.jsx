// LessonModals.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const LessonModals = ({
  showAddLesson,
  handleAddLessonClose,
  eLesson,
  setELesson,
  handleAddLesson,
  getRootProps,
  getInputProps,
  isDragActive,
}) => {
  return (
    <Modal show={showAddLesson} onHide={handleAddLessonClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Lesson</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          className="form-control mb-3"
          value={eLesson.title}
          onChange={(e) => setELesson({ ...eLesson, title: e.target.value })}
          placeholder="Lesson Title"
        />
        <textarea className="form-control mb-3"
          value={eLesson.description} // Use eLesson.description here
          onChange={(e) => setELesson({ ...eLesson, description: e.target.value })}
          placeholder="Lesson Description">
        </textarea>
        {/* <input
          type="text"
          className="form-control mb-3"
          value={eLesson.description} // Use eLesson.description here
          onChange={(e) => setELesson({ ...eLesson, description: e.target.value })}
          placeholder="Lesson Description"
        /> */}
        <div
          {...getRootProps()}
          className="dropzone p-4 border border-secondary rounded text-center mb-3"
          style={{ cursor: "pointer", backgroundColor: isDragActive ? "#f8f9fa" : "#fff" }}
        >
          <input {...getInputProps()} />
          {eLesson.mediaPreview ? (
            <>
              <p className="mb-2">
                <strong>Selected File:</strong>
              </p>
              {eLesson.media?.type?.startsWith("image/") ? (
                <img
                  src={eLesson.mediaPreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                  className="mb-2"
                />
              ) : eLesson.media?.type?.startsWith("video/") ? (
                <video width="100%" height="200" controls className="mb-2">
                  <source src={eLesson.mediaPreview} type={eLesson.media?.type} />
                  Your browser does not support the video tag.
                </video>
              ) : eLesson.media?.type === "application/pdf" ? (
                <div className="flex items-center gap-2 mb-2 text-red-600">
                  <i className="bx bxs-file-pdf bx-lg"></i>
                  <span>PDF File</span>
                </div>
              ) : eLesson.media?.type === "text/plain" ? (
                <div className="flex items-center gap-2 mb-2 text-gray-700">
                  <i className="bx bxs-file-txt bx-lg"></i>
                  <span>Text File</span>
                </div>
              ) : null}

              <p>{eLesson.media.name}</p>
            </>
          ) : (
            <p>Drag and drop a media file here, or click to select</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleAddLessonClose}>
          Close
        </Button>
        <Button variant="success" onClick={handleAddLesson}>
          <i className="bx bx-save"></i> Save Lesson
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LessonModals;