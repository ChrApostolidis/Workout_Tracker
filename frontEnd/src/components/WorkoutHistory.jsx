import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./WorkoutHistory.module.css";

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        if (!auth.token) {
          throw new Error("No authentication token found");
        }

        const res = await fetch("/api/workouts", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await res.json();
        console.log("Fetched workouts:", data);
        setWorkouts(data);
      } catch (err) {
        console.error("Error fetching workouts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [auth.token]); // Re-fetch when auth token changes

  if (loading) return <div className={styles.message}>Loading workouts...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!workouts.length)
    return <div className={styles.message}>No workouts yet.</div>;

  return (
    <div className={styles.workoutsList}>
      <h2>Your Workout History</h2>
      <div className={styles.cardGrid}>
        {workouts.map((w) => (
          <div
            key={w._id}
            className={styles.workoutCard}
            onClick={() => navigate(`/workout/${w._id}`)}
          >
            <div className={styles.cardHeader}>
              <span className={styles.cardDate}>
                {w.date
                  ? new Date(w.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                  : "No date"}
              </span>
              <span className={styles.cardDuration}>{w.duration}</span>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.cardExercises}>
                {w.exercises.length} exercises
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
