import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/SidebarLayout';;
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Teachers from '../pages/Teachers';
import Classes from '../pages/Classes';
import Courses from '../pages/Courses';
import Users from '../pages/Users';
import TeachersAttendance from '../pages/TeachersAttendance';
import Report from '../pages/Report';
import StudentDetail from '../pages/StudentDetail';
import Layout from '../components/Layout';


function App() {
  return (
    <Router>
      {/* <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-3" style={{ marginLeft: '260px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/students" element={<Students />}>
              <Route path=":id" element={<StudentDetail />} />
            </Route> */}
            {/* <Route path='students' index element={<Students />}>
              <Route path=':id' element={<StudentDetail />} />
            </Route>
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teachers_attendance" element={<TeachersAttendance />} />
            <Route path="/report" element={<Report />} /> */}
          {/* </Routes> */}
        {/* </div> */}
      {/* </div> */}
      <Routes>
        <Route path='/' element={<Layout/>}>
            <Route index element={<Dashboard/>}></Route>
            <Route path='students' element={<Students/>}/>
            <Route path='students/:id' element={<StudentDetail/>}/>
        </Route>
         <Route path="/teachers" element={<Teachers />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teachers_attendance" element={<TeachersAttendance />} />
            <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
