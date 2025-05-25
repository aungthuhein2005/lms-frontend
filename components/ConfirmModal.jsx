// components/ConfirmModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { hideConfirm } from '../features/ui/confirmSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function ConfirmModal() {
    const dispatch = useDispatch();
    const { show, message, title, onConfirm, onCancel } = useSelector((state) => state.confirm);

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        dispatch(hideConfirm());
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        dispatch(hideConfirm());
    };

    return (
        <Modal show={show} onHide={handleCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title || 'Confirm'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message || 'Are you sure?'}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant="danger" onClick={handleConfirm}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
}
