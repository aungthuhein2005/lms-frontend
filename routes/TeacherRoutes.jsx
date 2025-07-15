import { Route } from "react-router-dom";
import TeacherLayout from "../Layouts/TeacherLayout";
import Dashboard from "../pages/Teacher/Dashboard";
import TeacherProfile from "../pages/Teacher/TeacherProfile";
import Courses from "../pages/Teacher/Courses";
import Classes from "../pages/Teacher/Classes";
import ClassDetail from "../components/ClassDetail";
import Module from "../pages/Admin/Module";
import TeacherTimetable from "../pages/Teacher/TeacherTimeTable";
import CreateExam from "../pages/Teacher/CreateExam";
import EditExam from "../pages/Teacher/EditExam";
import Exam from "../pages/Teacher/Exam";
import ExamDetailPage from "../pages/Teacher/ExamDetail";
import TeacherAssignmentPage from "../pages/Teacher/TeacherAssignment";
import ViewSubmissions from "../pages/Teacher/ViewSubmission";
import ProgreassGrading from "../pages/Teacher/ProgreassGrading";
import GradingPage from "../pages/Teacher/GradingPage";

const TeacherRoutes = (
    <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<Dashboard/>} />
        <Route path="profile" element={<TeacherProfile/>}/>
        <Route path="courses" element={<Courses/>}/>
        <Route path="courses/:courseId/modules" element={<Module/>}/>
        <Route path="classes" element={<Classes/>}/>
        <Route path="classes/:id" element={<ClassDetail/>}/>
        <Route path="timetable" element={<TeacherTimetable/>} />
        <Route path="exams" element={<Exam />} />
    <Route path="exams/:id/details" element={<ExamDetailPage />} />
    <Route path="exams/create" element={<CreateExam />} />
    <Route path="exams/edit/:id" element={<EditExam />} />
    <Route path="assignments" element={<TeacherAssignmentPage />} />
    <Route path="grades" element={<ProgreassGrading />} />
    <Route path="grades/student/:id" element={<GradingPage />} />
    <Route path="assignments/:assignmentId/submissions" element={<ViewSubmissions />} />
    </Route>
)

export default TeacherRoutes;