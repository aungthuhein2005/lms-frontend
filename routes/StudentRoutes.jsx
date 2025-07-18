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
import ClassDetail from "../components/ClassDetail";
import Module from "../pages/Admin/Module";
import Progress from "../pages/Student/Progress";
import ExamAttempt from "../pages/Student/ExamAttempt";
import ExamResultPage from "../pages/Student/ExamResult";

const StudentRoutes  = (
    <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="classes" element={<Classes/>} />
        <Route path="classes/:id" element={<ClassDetail/>} />
        <Route path="courses/:courseId/modules" element={<Module/>}/>
      <Route path="timetable" element={<Timetable/>} />
        <Route path="assignments" element={<Assignments/>} />
        <Route path="grades" element={<Grades/>} />
       <Route path="exams" element={<Exams />} />
    <Route path="exams/:id/attempt" element={<ExamAttempt />} />
    <Route path="exam/:id/result" element={<ExamResultPage />} />
        <Route path="progress" element={<Progress/>} />
        <Route path="attendances" element={<Attendances/>} />
        <Route path="settings" element={<Settings/>} />
    </Route>
)

export default StudentRoutes;