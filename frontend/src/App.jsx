import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import LoginRegistrationForm from './pages/LoginRegistrationForm';
import FormPage from './pages/FormPage';
import WaitingPage from './pages/WaitingPage';
import IDPage from './pages/IDPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegistrationForm />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/waiting" element={<WaitingPage />} />
        <Route path="/id" element={<IDPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Redirect any unknown routes back to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;