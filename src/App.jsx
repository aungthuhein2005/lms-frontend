import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminRoutes from '../routes/AdminRoutes';
import StudentRoutes from '../routes/StudentRoutes';
import TeacherRoutes from '../routes/TeacherRoutes';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { useSelector } from 'react-redux';
import React from 'react';
import ConfirmModal from '../components/ConfirmModal';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
    
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Redirect any other route to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            {/* Here you can spread AdminRoutes, StudentRoutes, TeacherRoutes, 
                assuming these export arrays of <Route> or a single <Route> */}
            {AdminRoutes}
            {StudentRoutes}
            {TeacherRoutes}
            {/* Redirect unknown routes to a dashboard or something */}
            {/* <Route path="*" element={<Navigate to="/admin" replace />} /> */}
          </>
        )}
      </Routes>
    </Router>
    <ConfirmModal/>
    </>
  );
}

export default App;
