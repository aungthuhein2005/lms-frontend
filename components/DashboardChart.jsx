import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

// Sample data - replace with your real API data or props
const userStats = [
  { name: "Students", value: 150 },
  { name: "Teachers", value: 30 },
  { name: "Others", value: 20 },
];

const courseProgress = [
  { course: "Java OOP", progress: 80 },
  { course: "React JS", progress: 65 },
  { course: "Data Structures", progress: 90 },
];

const classStudentCount = [
  { className: "Java Class A", students: 30 },
  { className: "Web Class B", students: 25 },
  { className: "Python Class C", students: 40 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardCharts() {
  return (
    <div className="mt-5">
      <h3>Dashboard Charts</h3>

      {/* Pie chart for user distribution */}
      <div style={{ width: "100%", height: 300 }}>
        <h5>User Distribution</h5>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={userStats}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {userStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart for course progress */}
      <div style={{ width: "100%", height: 300, marginTop: 50 }}>
        <h5>Course Progress (%)</h5>
        <ResponsiveContainer>
          <BarChart data={courseProgress} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="course" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="progress" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart for class student count */}
      <div style={{ width: "100%", height: 300, marginTop: 50 }}>
        <h5>Class Student Count</h5>
        <ResponsiveContainer>
          <BarChart data={classStudentCount} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="className" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
