import { Route } from "react-router-dom";
import Dashboard from "../pages/Student/Dashboard";
import StudentLayout from "../Layouts/StudentLayout";
import Profile from "../pages/Student/Profile";
import Classes from "../pages/Student/Classes";
import Timetable from "../pages/Student/Timetable";
import Assignments from "../pages/Student/Assignments";
import Grades from "../pages/Student/Grades";
import Exams from "../pages/Student/Exams";
import Attendances from "../pages/Student/Attendances";
import Settings from "../pages/Student/Settings";

const StudentRoutes  = (
    <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="classes" element={<Classes/>} />
      <Route path="timetable" element={<Timetable/>} />
        <Route path="assignments" element={<Assignments/>} />
        <Route path="grades" element={<Grades/>} />
        <Route path="exams" element={<Exams/>} />
        <Route path="attendances" element={<Attendances/>} />
        <Route path="settings" element={<Settings/>} />
    </Route>
)

export default StudentRoutes;