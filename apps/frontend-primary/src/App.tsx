import './App.css'
import { Route, Routes } from 'react-router'
import { AuthPage } from './auth/auth'
import { DashBoard } from './student-dashboard/student.dashboard'
import TeacherDashboard from './teacher-dashboard/teacher.dashboard'

function App() {

  return (
    <>

      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/student-dashboard" element={<DashBoard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard/>} />
      </Routes>

    </>
  )
}

export default App
