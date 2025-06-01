import { useEffect, useState } from "react";
import styles from "./WorkoutHistory.module.css";

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workouts")
      .then((res) => res.json())
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading workouts...</div>;
  if (!workouts.length) return <div>No workouts yet.</div>;

  return (
    <div className={styles.workoutsList}>
      <h2>Your Workout History</h2>
      <div className={styles.cardGrid}>
        {workouts.map((w) => (
          <div key={w._id} className={styles.workoutCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardDate}>
                {w.date ? new Date(w.date).toLocaleDateString() : "No date"}
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