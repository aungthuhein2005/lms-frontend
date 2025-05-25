// ModuleModals.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModuleModals = ({
  showAddModule,
  handleAddClose,
  moduleName,
  setModuleName,
  moduleDescription,
  setModuleDescription,
  addModule,
  showEditModule,
  handleEditClose,
  eModule,
  updateModule,
}) => {
  return (
    <>
      {/* Add Module Modal */}
      <Modal show={showAddModule} onHide={handleAddClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-3"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            placeholder="Module Name"
          />
          <input
            type="text"
            className="form-control"
            value={moduleDescription}
            onChange={(e) => setModuleDescription(e.target.value)}
            placeholder="Module Description"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddClose}>
            Close
          </Button>
          <Button variant="success" onClick={() => addModule({ name: moduleName, description: moduleDescription })}>
            <i className="bx bx-save"></i> Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Module Modal */}
      <Modal show={showEditModule} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-3"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            placeholder="Module Name"
          />
          <input
            type="text"
            className="form-control"
            value={moduleDescription}
            onChange={(e) => setModuleDescription(e.target.value)}
            placeholder="Module Description"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Close
          </Button>
          <Button variant="success" onClick={() => updateModule({ id: eModule.id, name: moduleName, description: moduleDescription })}>
            <i className="bx bx-save"></i> Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModuleModals;