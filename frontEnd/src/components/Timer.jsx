import { useEffect, useRef, useState } from "react";
import styles from "./Timer.module.css";
import { formatTime } from "../utils/time";
import { useNavigate } from "react-router-dom";

export default function Timer({ running, onStop }) {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (!running && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      if (onStop) onStop(seconds);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  return (
    <>
      <div className={styles.timerContainer}>
        <button
          className={styles.goBackButton}
          onClick={(e) => {
            e.preventDefault();
            const confirmLeave = window.confirm(
              "Please make sure to save your workout before going back,all your progress will be lost. Are you sure you want to leave?"
            );
            if (confirmLeave) {
              navigate("/");
            }
          }}
        >
          Go Back
        </button>
        <span>{formatTime(seconds)}</span>
      </div>
    </>
  );
}
