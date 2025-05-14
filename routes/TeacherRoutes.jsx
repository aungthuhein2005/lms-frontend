import { Route } from "react-router-dom";
import TeacherLayout from "../Layouts/TeacherLayout";
import Dashboard from "../pages/Teacher/Dashboard";

const TeacherRoutes = (
    <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<Dashboard/>} />
        <Route path="profile" element={<h1>Teacher Profile</h1>} />
    </Route>
)

export default TeacherRoutes;