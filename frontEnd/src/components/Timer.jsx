import { useEffect, useRef, useState } from "react";
import styles from "./Timer.module.css";
import { formatTime } from "../utils/time";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CustomPopUp from "./CustomPopUp";

const STORAGE_KEY = "timerStartTimestamp";

export default function Timer({ running, onStop }) {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      // Check if we already saved a start timestamp
      let startTimestamp = localStorage.getItem(STORAGE_KEY);

      if (!startTimestamp) {
        // Save current timestamp if none
        startTimestamp = Date.now();
        localStorage.setItem(STORAGE_KEY, startTimestamp);
      }

      // Calculate elapsed seconds based on stored timestamp
      const updateElapsed = () => {
        const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
        setSeconds(elapsed);
      };

      updateElapsed(); // Update immediately on start

      intervalRef.current = setInterval(() => {
        updateElapsed();
      }, 1000);
    } else {
      // Timer stopped
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Remove stored start time so timer resets next time
      localStorage.removeItem(STORAGE_KEY);
      if (onStop) onStop(seconds);
    }

    // Cleanup on unmount or when running changes
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleShowAlert = () => {
    setAlertMessage(
      "Are you sure you want to go back? Your progress will be lost!"
    );
    setShowAlert(true);
  };

  const handleGoBack = () => {
    setShowAlert(false);
    navigate("/");
  };

  return (
    <div className={styles.timerBar}>
      {showAlert && (
        <CustomPopUp
          message={alertMessage}
          type="warning"
          onClose={() => setShowAlert(false)}
          onConfirm={handleGoBack}
        />
      )}
      <button
        className={styles.goBackButton}
        onClick={(e) => {
          e.preventDefault();
          handleShowAlert();
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className={styles.timerText}>{formatTime(seconds)}</div>
    </div>
  );
}
