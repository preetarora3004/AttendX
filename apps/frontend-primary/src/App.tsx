import './App.css'
import { Route, Routes } from 'react-router'
import { AuthPage } from './auth/auth'

function App() {

  return (
    <>

      <Routes>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>

    </>
  )
}

export default App
