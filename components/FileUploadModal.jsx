import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function FileUploadModal({ show, handleClose }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setFile(e.dataTransfer.files[0]);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Assignment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          style={{
            border: '2px dashed #6c757d',
            borderRadius: '10px',
            padding: '40px',
            textAlign: 'center',
            backgroundColor: dragOver ? '#f1f1f1' : '#fff',
            transition: 'background-color 0.3s ease'
          }}
        >
          <p>Drag and drop a file here, or click to select one</p>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="fileInput"
          />
          <label htmlFor="fileInput" className="btn btn-secondary mt-2">Choose File</label>
          {file && <div className="mt-3"><strong>Selected:</strong> {file.name}</div>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={() => alert(`Uploading: ${file?.name || 'No file selected'}`)}>Upload</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FileUploadModal;
