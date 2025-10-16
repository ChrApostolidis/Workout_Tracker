import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./WorkoutDetails.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";

export default function WorkoutDetails() {
  const { workoutId } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      try {
        const res = await fetch(`/api/workouts/${workoutId}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch workout details");

        const data = await res.json();
        setWorkout(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutDetails();
  }, [workoutId, auth.token]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        const res = await fetch(`/api/workouts/${workoutId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to delete workout");

        navigate("/", { replace: true });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading)
    return <div className={styles.message}>Loading workout details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!workout) return <div className={styles.message}>Workout not found</div>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.detailsContainer}>
        <div className={styles.headerActions}>
          <button className={styles.backButton} onClick={() => navigate("/")}>
            Back to Home
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
        <h2>Workout Details</h2>
        <div className={styles.workoutInfo}>
          <p className={styles.date}>
            {new Date(workout.createdAt).toLocaleDateString()}
          </p>
          <p className={styles.duration}>Duration: {workout.duration}</p>
        </div>
        <div className={styles.exercisesList}>
          {workout.exercises.map((exercise, index) => (
            <div key={index} className={styles.exerciseCard}>
              <h3>{exercise.name}</h3>
              <p className={styles.category}>{exercise.category}</p>
              <div className={styles.sets}>
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className={styles.set}>
                    <span>Set {setIndex + 1}:</span>
                    <span>{set.reps} reps</span>
                    <span>{set.weight} kg</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
