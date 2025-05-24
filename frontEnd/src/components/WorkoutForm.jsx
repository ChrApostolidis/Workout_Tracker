import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShowExercises from "./ShowExercises";
import { useEffect } from "react";

export default function WorkoutForm() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/workouts/", workout);
      setWorkout({ exercises: [] });
      alert("Workout logged!");
    } catch (err) {
      console.error(err);
      alert("Error saving workout");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
        <h2 className="text-xl font-bold">Log a Workout</h2>

        <div>
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() =>
                setExerciseForm({ ...exerciseForm, category: cat.name })
              }
            >
              <img
                src={`http://localhost:5000${cat.imageUrl}`}
                alt={cat.name}
                width={50}
                height={50}
              />
              <div>{cat.name}</div>
            </div>
          ))}
        </div>

        <div className="border p-4 rounded bg-gray-100">
          <input
            name="category"
            value={exerciseForm.category}
            onChange={handleExerciseFormChange}
            placeholder="Category"
            type="hidden"
          />

          {/* <input
            name="name"
            value={exerciseForm.name}
            onChange={handleExerciseFormChange}
            placeholder="Exercise Name"
            className="w-full mb-2 border px-3 py-1 rounded"
          /> */}

          <select
            name="name"
            value={exerciseForm.name}
            onChange={handleExerciseFormChange}
          >
            <option value="">Select Exercise</option>
            {exercises
              .filter((ex) => ex.category === exerciseForm.category) // show only exercises for the selected category
              .map((ex) => (
                <option key={ex._id} value={ex.name}>
                  {ex.name}
                </option>
              ))}
          </select>

          {exerciseForm.sets.map((set, setIndex) => (
            <div key={setIndex}>
              <input
                type="number"
                name="reps"
                value={set.reps}
                onChange={(e) => handleSetFormChange(setIndex, e)}
                placeholder="Reps"
                className="w-1/2 border px-2 py-1 rounded"
              />
              <input
                type="number"
                name="weight"
                value={set.weight}
                onChange={(e) => handleSetFormChange(setIndex, e)}
                placeholder="Weight"
                className="w-1/2 border px-2 py-1 rounded"
              />
              <button
                type="button"
                onClick={() => removeSetFromForm(setIndex)}
                className="text-sm mt-2 text-blue-600"
              >
                Remove Set
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSetToForm}
            className="text-sm mt-2 text-blue-600"
          >
            Add Set
          </button>
        </div>

        <button type="button" onClick={addExercise}>
          Add Exercise
        </button>

        <button type="submit">Save Workout</button>
      </form>

      <ShowExercises exercises={workout.exercises} />
      <button onClick={() => navigate("/")}>Go Back</button>
    </>
  );
}
