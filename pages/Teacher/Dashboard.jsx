import React from 'react';
import { Card, Col, Container, Row, ProgressBar, ListGroup, Spinner, Badge, Alert } from 'react-bootstrap';

import { useSelector } from 'react-redux';
import { Book, ClipboardCheck, PersonCheck, ClipboardData } from 'react-bootstrap-icons'; 
import { useGetAssignedClassesCountQuery, useGetAssignedCoursesCountQuery, useGetClassSummaryQuery, useGetCourseProgressQuery, useGetNearDeadlineAssignmentsQuery, useGetRecentExamsQuery } from '../../features/api/teacherDashboardApiSlice';
import ClassProgress from '../../components/ClassProgress';
// const ClassProgress = ({ className, students }) => (
//   <Col lg={6}>
//     <Card className="shadow-sm border-0 h-100">
//       <Card.Header className="bg-transparent border-0 pt-3">
//         <h5 className="fw-bold mb-0">📊 Class Progress: {className}</h5>
//       </Card.Header>
//       <Card.Body>
//         {/* Render your class progress chart/table here */}
//         <p>Class progress for {className} will be displayed here.</p>
//         <ListGroup variant="flush">
//           {students.map((student, index) => (
//             <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center px-0">
//               <span>{student.name}</span>
//               <ProgressBar now={student.progress} style={{ width: '50%' }} />
//               <Badge bg={student.progress >= 70 ? "success" : "warning"}>{student.progress}%</Badge>
//             </ListGroup.Item>
//           ))}
//         </ListGroup>
//       </Card.Body>
//     </Card>
//   </Col>
// );

const RecentExamsCard = ({ exams }) => (

  <Col lg={6}>
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-transparent border-0 pt-3">
        <h5 className="fw-bold mb-0">📝 Recent Exams & Grades</h5>
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {exams.length > 0 ? (
            exams.map((exam, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center px-0">
                <div>
                  <h6 className="mb-0">{exam.examTitle}</h6>
                  <small className="text-muted">{exam.examDescription}</small>
                </div>
                
              </ListGroup.Item>
            ))
          ) : (
            <Alert variant="info">No recent exams to display.</Alert>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  </Col>
);


export default function TeacherDashboard() {
  const { roleId: teacherId } = useSelector(state => state.auth.user);

  // Fetch data using the actual teacherId
  const { data: progressData, isLoading: loadingProgress } = useGetCourseProgressQuery(teacherId);
  const { data: assignments, isLoading: loadingAssignments } = useGetNearDeadlineAssignmentsQuery(teacherId);
  const { data: courseCount, isLoading: loadingCourseCount } = useGetAssignedCoursesCountQuery(teacherId);
  const { data: classCount, isLoading: loadingClassCount } = useGetAssignedClassesCountQuery(teacherId);
  const {data: recentExams,isLoading: loadingRecentExams} = useGetRecentExamsQuery(teacherId);
    const {data: classSummary} = useGetClassSummaryQuery(1);
     console.log(classSummary);
  const isLoading = loadingProgress || loadingAssignments || loadingCourseCount || loadingClassCount;


  return (
    isLoading ? (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    ) : (
      <Container fluid className="p-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="h2 fw-bold">👋 Welcome Back, Teacher!</h1>
            <p className="text-muted">Here's your teaching overview for the week.</p>
          </Col>
        </Row>

        {/* Stats Overview */}
        <Row className="g-4 mb-4">
          <Col md={6} lg={3}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-primary text-white p-3 rounded-3 me-3">
                  <Book size={24} />
                </div>
                <div>
                  <Card.Title className="h4 fw-bold mb-0">{courseCount}</Card.Title> {/* Using courseCount */}
                  <Card.Text className="text-muted mb-0">Courses Taught</Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-warning text-white p-3 rounded-3 me-3">
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <Card.Title className="h4 fw-bold mb-0">{classCount}</Card.Title>
                  <Card.Text className="text-muted mb-0">Classes</Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-warning text-white p-3 rounded-3 me-3">
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <Card.Title className="h4 fw-bold mb-0">{assignments.length}</Card.Title>
                  <Card.Text className="text-muted mb-0">Upcoming Assignments</Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* <Col md={6} lg={3}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-success text-white p-3 rounded-3 me-3">
                  <PersonCheck size={24} />
                </div>
                <div>
                  <Card.Title className="h4 fw-bold mb-0">{attendanceRate}%</Card.Title> 
                  <Card.Text className="text-muted mb-0">Attendance Rate</Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col> */}

          <Col md={6} lg={3}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-info text-white p-3 rounded-3 me-3">
                  <ClipboardData size={24} />
                </div>
                <div>
                  <Card.Title className="h4 fw-bold mb-0">3</Card.Title>
                  <Card.Text className="text-muted mb-0">Reports Pending</Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Upcoming Assignments & Courses Progress */}
        <Row className="g-4">
          <Col lg={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-transparent border-0 pt-3">
                <h5 className="fw-bold mb-0">📌 Upcoming Assignments</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {assignments.length > 0 ? (
                    assignments.map((a, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center px-0">
                        <div>
                          <h6 className="mb-0">{a.title}</h6>
                          <small className="text-muted">Due: {a.dueDate}</small>
                        </div>
                        <Badge bg="danger" pill>Due Soon</Badge>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <Alert variant="success">No upcoming assignments!</Alert>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-transparent border-0 pt-3">
                <h5 className="fw-bold mb-0">📚 Course Progress</h5>
              </Card.Header>
              <Card.Body>
                {progressData.length > 0 ? ( // Using progressData
                  progressData.map((course, index) => (
                    <div key={index} className="mb-4">
                      <div className="d-flex justify-content-between mb-1">
                        <h6 className="fw-semibold mb-0">{course.courseTitle}</h6>
                        <span className="text-muted small">{course.averageProgress.toFixed(0)}%</span>
                      </div>
                      <ProgressBar now={course.averageProgress} variant={course.averageProgress >= 80 ? "success" : "primary"} style={{ height: '8px' }} />
                    </div>
                  ))
                ) : (
                  <Alert variant="info">No course progress to display.</Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Class Progress with Chart & Table */}
        <Row className="g-4 mt-1">
          {/* <ClassProgress className="Java Class A" students={sampleStudents} /> */}
          <ClassProgress teacherId={teacherId}/>
          <RecentExamsCard exams={recentExams} /> {/* Moved RecentExamsCard into the same row for better layout */}
        </Row>
      </Container>
    )
  );
}