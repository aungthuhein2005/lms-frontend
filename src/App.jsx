import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/SidebarLayout";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import Classes from "../pages/Classes";
import Courses from "../pages/Courses";
import Module from "../pages/Module";
import Users from "../pages/Users";
import TeachersAttendance from "../pages/TeachersAttendance";
import Report from "../pages/Report";
import StudentDetail from "../pages/StudentDetail";
import Layout from "../components/Layout";

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-3">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />}></Route>
              <Route path="students" element={<Students />} />
              <Route path="students/:id" element={<StudentDetail />} />
              <Route path="courses" element={<Courses />} />
              <Route
                path="courses/:courseId/modules"
                element={<Module />}
              ></Route>
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
