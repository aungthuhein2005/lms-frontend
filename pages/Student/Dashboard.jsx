import axios from 'axios';
import { Container, Row, Col, Card, ListGroup, ProgressBar, Button, Badge, Alert } from 'react-bootstrap';
import { Book, CheckCircleFill, ClockHistory, HourglassSplit, ListTask, MortarboardFill, StarFill } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { useGetClassCountQuery, useGetCourseCountQuery, useGetNearDeadlineAssignmentsQuery } from '../../features/api/studentDashboardApiSlice';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Helper function to format dates and show relative time
const formatDueDate = (dueDate) => {
  const date = new Date(dueDate);
  const today = new Date();
  const diffTime = date - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: "Overdue", variant: "danger" };
  if (diffDays === 0) return { text: "Due Today", variant: "danger" };
  if (diffDays === 1) return { text: "Due Tomorrow", variant: "warning" };
  return { text: `Due in ${diffDays} days`, variant: "info" };
};


export default function StudentDashboard() {
  const { roleId: studentId } = useSelector(state => state.auth.user);

  // --- Mock Data (Replace with API calls) ---
  // Mock grades data until an API endpoint is available
  const grades = [
    { course: "JavaScript Basics", grade: "A", feedback: "Excellent work on the final project!" },
    { course: "Data Structures", grade: "B+", feedback: "Good effort, focus on algorithm complexity." },
  ];

  // Quick Links can remain static or be fetched if they are dynamic
  const quickLinks = [
    { name: "My Courses", link: "/courses", icon: <Book /> },
    { name: "My Grades", link: "/grades", icon: <StarFill /> },
    { name: "All Assignments", link: "/assignments", icon: <ListTask /> },
    { name: "Discussions", link: "/discussion", icon: <MortarboardFill /> },
  ];

  // --- API Data Fetching ---
  const [courseProgressData, setCourseProgressData] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [error, setError] = useState(null);

  const { data: classCount = 0 } = useGetClassCountQuery(studentId);
  const { data: courseCount = 0 } = useGetCourseCountQuery(studentId);
  const { data: assignments = [], isLoading: isLoadingAssignments } = useGetNearDeadlineAssignmentsQuery(studentId);
  console.log(assignments);
  
  useEffect(() => {
    const fetchProgress = async () => {
      if (!studentId) return;
      setLoadingProgress(true);
      try {
        const response = await axios.get(`http://localhost:8080/progress/student-dashboard-summary`, {
          params: { studentId }
        });
        setCourseProgressData(response.data);
      } catch (err) {
        setError(err.message || 'Error fetching course progress');
      } finally {
        setLoadingProgress(false);
      }
    };
    fetchProgress();
  }, [studentId]);

  ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

  const performanceData = {
  labels: ['JavaScript', 'Data Structures', 'Databases', 'UI/UX', 'Algorithms', 'Networking'],
  datasets: [
    {
      label: 'Current Performance',
      data: [85, 92, 78, 81, 88, 75], // Example scores (out of 100)
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
    },
  ],
};

// Define options to customize the chart's appearance
const performanceOptions = {
  scales: {
    r: {
      angleLines: {
        display: false,
      },
      suggestedMin: 0,
      suggestedMax: 100,
      pointLabels: {
        font: {
          size: 12, // Adjust font size for course names
        }
      },
      ticks: {
        // Hides the numeric labels on the spokes
        display: false 
      }
    },
  },
  plugins: {
    legend: {
      // Hides the legend ('Current Performance') at the top
      display: false, 
    },
  },
  maintainAspectRatio: false, // Important for fitting chart in the card
};

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="h2 fw-bold">👋 Welcome Back, Student!</h1>
          <p className="text-muted">Here's your academic snapshot. Keep up the great work!</p>
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
                <Card.Title className="h4 fw-bold mb-0">{courseCount}</Card.Title>
                <Card.Text className="text-muted mb-0">Courses Enrolled</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success text-white p-3 rounded-3 me-3">
                <MortarboardFill size={24} />
              </div>
              <div>
                <Card.Title className="h4 fw-bold mb-0">{classCount}</Card.Title>
                <Card.Text className="text-muted mb-0">Classes Joined</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-warning text-white p-3 rounded-3 me-3">
                <ListTask size={24} />
              </div>
              <div>
                <Card.Title className="h4 fw-bold mb-0">{assignments.length}</Card.Title>
                <Card.Text className="text-muted mb-0">Pending Assignments</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-info text-white p-3 rounded-3 me-3">
                <CheckCircleFill size={24} />
              </div>
              <div>
                <Card.Title className="h4 fw-bold mb-0">85%</Card.Title>
                <Card.Text className="text-muted mb-0">Overall Progress</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="g-4">
        {/* Upcoming Assignments */}
        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-transparent border-0 pt-3">
              <h5 className="fw-bold mb-0">🗓️ Upcoming Assignments</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {isLoadingAssignments ? <p>Loading assignments...</p> :
                  assignments.length > 0 ? assignments.map(item => {
                    const dueDateInfo = formatDueDate(item.dueDate);
                    return (
                      <ListGroup.Item key={item.id || item.title} className="d-flex justify-content-between align-items-center px-0">
                        <div>
                          <h6 className="mb-0">{item.title}</h6>
                          <small className="text-muted">{item.classname || 'Class'}</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Badge pill bg={dueDateInfo.variant}>{dueDateInfo.text}</Badge>
                          <Button as={Link} to={`assignments`} variant="outline-primary" size="sm">View</Button>
                        </div>
                      </ListGroup.Item>
                    )
                  }) : (
                    <Alert variant="success">No upcoming assignments. You're all caught up!</Alert>
                  )
                }
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Continue Learning */}
        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-transparent border-0 pt-3">
              <h5 className="fw-bold mb-0">🚀 Continue Learning</h5>
            </Card.Header>
            <Card.Body>
              {loadingProgress ? <p>Loading progress...</p> :
                courseProgressData.map(course => (
                  <div key={course.courseId || course.courseTitle} className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <h6 className="fw-semibold mb-0">{course.courseTitle}</h6>
                      <span className="text-muted small">
                        {course.progressPercent >= 100 ? <CheckCircleFill className="text-success me-1"/> : <HourglassSplit className="text-warning me-1"/>}
                        {course.progressPercent.toFixed(0)}%
                      </span>
                    </div>
                    <ProgressBar now={course.progressPercent} variant={course.progressPercent >= 100 ? "success" : "primary"} style={{ height: '8px' }} />
                  </div>
                ))
              }
              {error && <Alert variant="danger">{error}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Secondary Content */}
      <Row className="g-4 mt-1">
        {/* Recent Grades */}
        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-transparent border-0 pt-3">
              <h5 className="fw-bold mb-0">🌟 Recent Grades & Feedback</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {grades.length > 0 ? grades.map((g, index) => (
                  <ListGroup.Item key={index} className="px-0">
                    <div className="d-flex justify-content-between">
                      <p className="fw-semibold mb-1">{g.course}</p>
                      <Badge bg="primary" pill className="fs-6">{g.grade}</Badge>
                    </div>
                    <p className="text-muted small mb-0">"{g.feedback}"</p>
                  </ListGroup.Item>
                )) : (
                  <Alert variant="info">Grades will appear here once they are posted.</Alert>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Links */}
        <Col lg={6}>
          <Card className="shadow-sm border-0 h-100">
    <Card.Header className="bg-transparent border-0 pt-3">
      <h5 className="fw-bold mb-0">📊 Performance Snapshot</h5>
    </Card.Header>
    <Card.Body>
      {/* Set a fixed height for the container to ensure proper rendering */}
      <div style={{ height: '280px' }}>
        <Radar data={performanceData} options={performanceOptions} />
      </div>
    </Card.Body>
  </Card>
        </Col>
      </Row>

    </Container>
  );
}