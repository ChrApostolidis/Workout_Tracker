import styles from "./ShowExercises.module.css";

export default function ShowExercises({ exercises }) {
  return (
    <div className={styles.summaryContainer}>
      <h3>Current Workout Summary</h3>
      {exercises.length === 0 ? (
        <p className={styles.center}>No exercises added yet.</p>
      ) : (
        <ul className={styles.exerciseList}>
          {exercises.map((exercise, exIndex) => (
            <li key={exIndex} className={styles.exerciseItem}>
              <span className={styles.exerciseTitle}>
                {exercise.category || "Unnamed Category"}:
              </span>
              <span className={styles.exerciseTitle}>
                {exercise.name || "Unnamed Exercise"}
              </span>
              <ul className={styles.setList}>
                {exercise.sets.map((set, setIndex) => (
                  <li key={setIndex} className={styles.setItem}>
                    Reps: {set.reps || "-"}, Weight: {set.weight || "-"}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
