import React, { useCallback, useState } from 'react';
import {
  Badge, Button, Card, Row, Col, Modal, Spinner
} from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { useSubmitAssignmentMutation } from '../features/api/assignementApiSlice';
import { uploadMedia } from '../helpers/fileUploader';

export default function AssignmentCard({ assignment }) {
  const { roleId } = useSelector(state => state.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitAssignment] = useSubmitAssignmentMutation();

  const {
    id,
    title,
    description,
    dueDate,
    point,
    media,
    status,
    teacher,
    classname,
  } = assignment;

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setPreviewUrl(URL.createObjectURL(uploadedFile));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': [],
      'image/*': [],
      'application/pdf': [],
      'text/plain': []
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return alert("No file selected!");

    setIsUploading(true);
    const result = await uploadMedia(file);
    setIsUploading(false);

    if (result) {
      await submitAssignment({
        assignmentId: id,
        studentId: roleId,
        fileUrl: result.mediaURL
      });
      alert("Upload successful!");
      setShowModal(false);
      setFile(null);
      setPreviewUrl(null);
    } else {
      alert("Upload failed!");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <Card className="shadow-sm mb-4 mx-2">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={9}>
              <h5 className="mb-1">
                {title}{' '}
                <Badge
                  bg={status === 'Submitted' ? 'success' : 'warning'}
                  className="ms-2"
                >
                  {status || 'Pending'}
                </Badge>
              </h5>
              <p className="mb-1 text-muted">
                <strong>Class:</strong> {classname} &nbsp;|&nbsp;
                <strong>Teacher:</strong> {teacher}
              </p>
              <p className="mb-2">{description}</p>
              <p className="mb-0">
                <strong>Due Date:</strong> {dueDate} &nbsp;&nbsp;
                <strong>Points:</strong> {point}
              </p>

              {media && (
                <a
                  href={media}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-block mt-2 text-primary fw-semibold"
                >
                  📎 View Attachment
                </a>
              )}
            </Col>

            <Col md={3} className="text-md-end mt-3 mt-md-0">
              {status !== 'Submitted' && (
                <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                  Submit Assignment
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            {...getRootProps()}
            className="p-4 border border-secondary rounded text-center mb-3"
            style={{ cursor: "pointer", backgroundColor: isDragActive ? "#f8f9fa" : "#fff" }}
          >
            <input {...getInputProps()} />
            {previewUrl ? (
              <>
                <p><strong>Selected File:</strong></p>
                {file.type.startsWith("image/") && (
                  <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px" }} className="mb-2" />
                )}
                {file.type.startsWith("video/") && (
                  <video width="100%" height="200" controls className="mb-2">
                    <source src={previewUrl} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                )}
                {file.type === "application/pdf" && (
                  <div className="text-danger mb-2">
                    <i className="bx bxs-file-pdf bx-lg"></i> PDF File
                  </div>
                )}
                {file.type === "text/plain" && (
                  <div className="text-muted mb-2">
                    <i className="bx bxs-file-txt bx-lg"></i> Text File
                  </div>
                )}
                <p>{file.name}</p>
              </>
            ) : (
              <p>Drag and drop a file here, or click to select</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={isUploading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <Spinner animation="border" size="sm" /> Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
