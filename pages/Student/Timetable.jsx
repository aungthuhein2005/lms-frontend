import React from 'react';
import { Container, Table } from 'react-bootstrap';

const timetable = {
  Monday: ['Math', 'English', 'Science', 'History', 'PE'],
  Tuesday: ['Geography', 'Math', 'Art', 'Computer', 'English'],
  Wednesday: ['Science', 'English', 'Music', 'Math', 'Free'],
  Thursday: ['History', 'Geography', 'PE', 'Science', 'Math'],
  Friday: ['Computer', 'Math', 'English', 'Art', 'Free']
};

const times = ['8:00 - 9:00', '9:10 - 10:10', '10:20 - 11:20', '11:30 - 12:30', '1:30 - 2:30'];

function Timetable() {
  return (
    <Container className="">
      <h2 className="mb-4">Class Timetable</h2>
      <div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        Class 1
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Time</th>
            {Object.keys(timetable).map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((timeSlot, index) => (
            <tr key={index}>
              <td>{timeSlot}</td>
              {Object.values(timetable).map((classes, i) => (
                <td key={i}>{classes[index]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        Class 2
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Time</th>
            {Object.keys(timetable).map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((timeSlot, index) => (
            <tr key={index}>
              <td>{timeSlot}</td>
              {Object.values(timetable).map((classes, i) => (
                <td key={i}>{classes[index]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Class 3
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Time</th>
            {Object.keys(timetable).map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((timeSlot, index) => (
            <tr key={index}>
              <td>{timeSlot}</td>
              {Object.values(timetable).map((classes, i) => (
                <td key={i}>{classes[index]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
    </div>
  </div>
</div>
      
    </Container>
  );
}

export default Timetable;
