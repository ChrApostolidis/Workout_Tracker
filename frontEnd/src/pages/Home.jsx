import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import styles from "./Home.module.css";
import WorkoutHistory from "../components/WorkoutHistory";

export default function Home() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  // Redirect if not authenticated
  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={styles.appContent}>
      <div className={styles.header}>
        <button className={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </div>
      <div className={styles.centerContent}>
        <h1>Workout Tracker</h1>
        <p className={styles.mainParagraph}>
          Welcome to your fitness journey. Track your workouts, stay consistent,
          and become the strongest version of yourself — one rep at a time.
        </p>
        <button
          className={styles.mainButton}
          onClick={() =>
            navigate("/start-workout", { state: { startTimer: true } })
          }
        >
          Start your Workout
        </button>
      </div>
      <WorkoutHistory />
      <Footer />
    </div>
  );
}
