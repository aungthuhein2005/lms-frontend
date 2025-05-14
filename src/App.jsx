import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminRoutes from '../routes/AdminRoutes';
import StudentRoutes from '../routes/StudentRoutes';
import TeacherRoutes from '../routes/TeacherRoutes';
import Login from '../pages/Login';
import Register from '../pages/Register';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register/>}/>
        {AdminRoutes}
        {StudentRoutes}
        {TeacherRoutes}
      </Routes>
    </Router>
  );
}

export default App;
