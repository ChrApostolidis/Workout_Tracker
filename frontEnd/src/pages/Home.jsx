import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.appContent}>
      <div className={styles.centerContent}>
        <h1>Workout Tracker</h1>
        <p className={styles.mainParagraph}>
          Welcome to your fitness journey. Track your workouts, stay consistent,
          and become the strongest version of yourself — one rep at a time.
        </p>
        <button
          className={styles.mainButton}
          onClick={() => navigate("/start-workout")}
        >
          Start your Workout
        </button>
      </div>
      <Footer />
    </div>
  );
}
