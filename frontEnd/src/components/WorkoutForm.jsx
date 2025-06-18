import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./WorkoutForm.module.css";
import Timer from "./Timer";
import ShowExercises from "./ShowExercises";
import CustomPopUp from "./CustomPopUp";
import { formatTime } from "../utils/time";

export default function WorkoutForm() {
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [shakeTrigger, setShakeTrigger] = useState(0);

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
  const [seconds, setSeconds] = useState(() => {
    const savedTimer = localStorage.getItem("workoutTimer");
    return savedTimer ? parseInt(savedTimer, 10) : 0;
  });

  const [formError, setFormError] = useState("");

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
    // Re-trigger Animation
    setShakeTrigger((prev) => prev + 1);
    if (!exerciseForm.sets || exerciseForm.sets.length === 0) {
      setFormError("Please add at least one set.");
      return;
    }
    // Check that all sets have reps and weight
    for (const set of exerciseForm.sets) {
      const reps = Number(set.reps);
      const weight = Number(set.weight);
      if (set.weight < 0 || set.reps < 0) {
        setFormError("You can't have negative Sets or Weights.");
        return;
      }

      if (!set.reps || !set.weight || isNaN(reps) || isNaN(weight)) {
        setFormError("Sets and Reps cannot be empty.");
        return;
      }
    }
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
    setFormError(" ");
  };

  // Save workout data on every change in case of reloading the page
  useEffect(() => {
    if (workout.exercises.length > 0) {
      localStorage.setItem(
        "currentWorkout",
        JSON.stringify({
          exercises: workout.exercises,
          timer: seconds,
        })
      );
    }
  }, [workout.exercises, seconds]);

  // Load saved workout data on component mount
  useEffect(() => {
    const savedWorkout = localStorage.getItem("currentWorkout");
    if (savedWorkout) {
      const parsedWorkout = JSON.parse(savedWorkout);
      setWorkout((prevWorkout) => ({
        ...prevWorkout,
        exercises: parsedWorkout.exercises,
      }));
      setSeconds(parsedWorkout.timer);
    }
  }, []);

  // Clear timer when workout is completed
  const handleTimerStop = (finalElapsedTime) => {
    const token = localStorage.getItem("token");

    axios
      .post(
        "/api/workouts/",
        {
          ...workout,
          duration: formatTime(finalElapsedTime),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        localStorage.removeItem("workoutTimer");
        localStorage.removeItem("currentWorkout");
        setWorkout({ exercises: [] });
        setSeconds(0);
        setAlertMessage("Your workout has been saved!");
        setShowAlert(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        console.error("Error details:", err.response?.data || err);
        setFormError(err.response?.data?.message || "Error saving workout");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (workout.exercises.length === 0) {
      setFormError(
        "Please add at least one exercise before saving your workout."
      );
      return;
    }
    setTimerRunning(false);
  };

  return (
    <>
      <Timer running={timerRunning} onStop={handleTimerStop} />
      <div className={styles.workoutFormWrapper}>
        <div className={styles.mainContainer}>
          <div className={styles.leftPane}>
            <form onSubmit={handleSubmit}>
              <div className={styles.flexfornow}>
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
                      <p>
                        Please select a category to see available exercises.
                      </p>
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
                              selectedExercise === ex.name
                                ? styles.selected
                                : ""
                            }`}
                            onClick={() => {
                              setExerciseForm({
                                ...exerciseForm,
                                name: ex.name,
                              });
                              setSelectedExercise(ex.name);
                            }}
                          >
                            {ex.name}
                          </div>
                        ))}
                    </div>
                  )}
                  {formError && (
                    <AnimatePresence>
                      <motion.div
                        key={shakeTrigger}
                        className={styles.errorMessage}
                        initial={{ x: 0 }}
                        animate={{ x: [0, -8, 8, -6, 6, -4, 4, 0] }} 
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        {formError}
                      </motion.div>
                    </AnimatePresence>
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
                            <button
                              type="button"
                              className={styles.buttonDeleteSet}
                              onClick={() => removeSetFromForm(setIndex)}
                            >
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className={styles.buttonAddSet}
                        onClick={addSetToForm}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        Add Set
                      </button>
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
              </div>
              <div className={styles.containerButton}>
                <button type="submit" className={styles.buttonSave}>
                  Save Workout
                </button>
              </div>
            </form>
            {showAlert && (
              <CustomPopUp
                message={alertMessage}
                type="success" // can be 'success', 'error', or 'warning'
                onClose={() => setShowAlert(false)}
              />
            )}
          </div>
          <div className={styles.rightPane}>
            <ShowExercises exercises={workout.exercises} />
          </div>
        </div>
      </div>
    </>
  );
}
