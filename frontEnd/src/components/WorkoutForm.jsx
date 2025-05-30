import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { formatTime } from "../utils/time";

import styles from "./WorkoutForm.module.css";
import Timer from "./Timer";
import ShowExercises from "./ShowExercises";

export default function WorkoutForm() {
  const location = useLocation();

  const navigate = useNavigate();
  const [workout, setWorkout] = useState({
    exercises: [],
  });

  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    category: "",
    sets: [{ reps: "", weight: "" }],
  });

  const [categories, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Timer
  const [timerRunning, setTimerRunning] = useState(
    location.state?.startTimer || false
  );

  // Fetching data from the backend
  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    axios.get("/api/exercises").then((res) => setExercises(res.data));
  }, []);

  const handleExerciseFormChange = (e) => {
    setExerciseForm({ ...exerciseForm, [e.target.name]: e.target.value });
  };

  const handleSetFormChange = (setIndex, e) => {
    const updatedSets = [...exerciseForm.sets];
    updatedSets[setIndex][e.target.name] = e.target.value;
    setExerciseForm({ ...exerciseForm, sets: updatedSets });
  };

  const addSetToForm = () => {
    setExerciseForm({
      ...exerciseForm,
      sets: [...exerciseForm.sets, { reps: "", weight: "" }],
    });
  };

  const removeSetFromForm = (setIndex) => {
    const updatedSets = [...exerciseForm.sets];
    updatedSets.splice(setIndex, 1);
    setExerciseForm({ ...exerciseForm, sets: updatedSets });
  };

  // Add exercise to workout
  const addExercise = () => {
    if (!timerRunning) setTimerRunning(true);
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, exerciseForm],
    });
    // Reset the exercise form
    setExerciseForm({
      name: "",
      category: "",
      sets: [{ reps: "", weight: "" }],
    });
  };

  // Making sure the user doesn't lose his progress
  useEffect(() => {
    window.onbeforeunload = () =>
      "Refreshing will reset your workout progress!";
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTimerRunning(false);
  };

  const handleTimerStop = (finalElapsedTime) => {
    axios
      .post("/api/workouts/", {
        ...workout,
        duration: formatTime(finalElapsedTime),
      })
      .then(() => {
        setWorkout({ exercises: [] });
        alert("Another workout in the books keep up the good work!!");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        alert("Error saving workout");
      });
  };

  return (
    <>
      <Timer running={timerRunning} onStop={handleTimerStop} />
      <div className={styles.mainContainer}>
        <form onSubmit={handleSubmit}>
          <h2>Log an Exercise</h2>
          <div className={styles.categories}>
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() =>
                  setExerciseForm({ ...exerciseForm, category: cat.name })
                }
              >
                <div
                  className={`${styles.contentCategories} ${
                    exerciseForm.category === cat.name
                      ? styles.selectedCategory
                      : ""
                  }`}
                >
                  <img
                    src={`http://localhost:5000${cat.imageUrl}`}
                    alt={cat.name}
                    width={80}
                    height={80}
                  />
                  <div>
                    <p className={styles.contentName}> {cat.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <input
              name="category"
              value={exerciseForm.category}
              onChange={handleExerciseFormChange}
              placeholder="Category"
              type="hidden"
            />

            {!exerciseForm.category && (
              <div className={styles.selectCategory}>
                <p>Please select a category to see available exercises.</p>
              </div>
            )}

            {exerciseForm.category && (
              <div className={styles.exerciseList}>
                {exercises
                  .filter((ex) => ex.category === exerciseForm.category)
                  .map((ex) => (
                    <div
                      key={ex._id}
                      className={`${styles.exerciseItem} ${
                        selectedExercise === ex.name ? styles.selected : ""
                      }`}
                      onClick={() => {
                        setExerciseForm({ ...exerciseForm, name: ex.name });
                        setSelectedExercise(ex.name);
                      }}
                    >
                      {ex.name}
                    </div>
                  ))}
              </div>
            )}
            {exerciseForm.name && (
              <>
                {exerciseForm.sets.map((set, setIndex) => (
                  <div key={setIndex} className={styles.containerSet}>
                    <input
                      type="number"
                      name="reps"
                      value={set.reps}
                      onChange={(e) => handleSetFormChange(setIndex, e)}
                      placeholder="Reps"
                    />
                    <input
                      type="number"
                      name="weight"
                      value={set.weight}
                      onChange={(e) => handleSetFormChange(setIndex, e)}
                      placeholder="Weight"
                    />
                    <div className={styles.containerForButtons}>
                      <button type="button" onClick={addSetToForm}>
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSetFromForm(setIndex)}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className={styles.containerForButtons}>
            <button
              type="button"
              className={styles.buttonAddEx}
              onClick={addExercise}
            >
              Add Exercise
            </button>
          </div>
          <ShowExercises exercises={workout.exercises} />
          <div className={styles.containerButton}>
            <button type="submit" className={styles.buttonSave}>
              Save Workout
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
