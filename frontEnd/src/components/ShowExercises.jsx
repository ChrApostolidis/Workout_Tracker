export default function ShowExercises({ exercises }) {
    console.log(exercises);
    
  return (
    <div>
      <h3>Current Workout Summary</h3>
      {exercises.length === 0 ? (
        <p>No exercises added yet.</p>
      ) : (
        <ul>
          {exercises.map((exercise, exIndex) => (
            <li key={exIndex}>
              <strong>{exercise.category || "Unnamed Exercise"}</strong> <br />
              <strong>{exercise.name || "Unnamed Exercise"}</strong>
              <ul>
                {exercise.sets.map((set, setIndex) => (
                  <li key={setIndex}>
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
