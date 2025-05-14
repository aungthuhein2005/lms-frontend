import React, { useState } from 'react'
import CustomAlert from '../../components/Alert';
import { Button, Form } from 'react-bootstrap';
export default function TeacherCreate() {
  const [formData, setFormData] = useState({ userId: '', classId: '', courseId: '' });

    const classes = [
        { id: 1, name: 'Batch-1' },
        { id: 2, name: 'Batch-2' },
        { id: 3, name: 'Batch-3' },
    ];
    
    const courses = [
        { id: 1, name: 'Course-1' },
        { id: 2, name: 'Course-2' },
        { id: 3, name: 'Course-3' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div>
            <CustomAlert variant="success" title="Success!" message="Teacher created successfully!" />
            <h3>Create Teacher</h3>
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
                            <option value="">Assign to class</option>
                            {classes.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                     <Form.Group className="mb-3" controlId="formBasicCourse">
                        <Form.Label>Courses</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            name="courseId"
                            value={formData.courseId}
                            onChange={handleChange}
                        >
                            <option value="">Assign to course</option>
                            {courses.map((item) => (
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
