import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import StartWorkout from './pages/StartWorkout';
import WorkoutDetails from './pages/WorkoutDetails';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={<Login />} 
        />
        <Route 
          path="/register" 
          element={<Register />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={<Home />} 
        />
        <Route 
          path="/start-workout" 
          element={<StartWorkout />} 
        />
        <Route 
          path="/workout/:workoutId" 
          element={<WorkoutDetails />} 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;