import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import CustomAlert from '../../components/Alert';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../features/ui/alertSlice';

export default function StudentCreate() {

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({ userId: '', classId: '' });

    const classes = [
        { id: 1, name: 'Batch-1' },
        { id: 2, name: 'Batch-2' },
        { id: 3, name: 'Batch-3' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        dispatch(showAlert({
            show: true,
            title: 'Success',
            type: 'success',
            message: 'Student Created Successfully',
        }))
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div>
            
            <h3>Create Student</h3>
            <div className="p-3">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicUserId">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter user id"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicClass">
                        <Form.Label>Class</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            name="classId"
                            value={formData.classId}
                            onChange={handleChange}
                        >
                            <option value="">Open this select menu</option>
                            {classes.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Create
                    </Button>
                </Form>
            </div>
        </div>
    );
}
