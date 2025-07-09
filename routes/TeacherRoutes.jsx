import { Route } from "react-router-dom";
import TeacherLayout from "../Layouts/TeacherLayout";
import Dashboard from "../pages/Teacher/Dashboard";
import Exam from "../pages/Teacher/Exam";
import ExamDetail from "../pages/Teacher/ExamDetail";
import CreateExam from "../pages/Teacher/CreateExam";
import EditExam from "../pages/Teacher/EditExam";

const TeacherRoutes = (
  <Route path="/teacher" element={<TeacherLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="profile" element={<h1>Teacher Profile</h1>} />
    <Route path="exams" element={<Exam />} />
    <Route path="exams/:id/details" element={<ExamDetail />} />
    <Route path="exams/create" element={<CreateExam />} />
    <Route path="/teacher/exams/edit/:id" element={<EditExam />} />
  </Route>
);

export default TeacherRoutes;
