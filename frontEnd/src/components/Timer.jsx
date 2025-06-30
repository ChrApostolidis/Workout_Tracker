import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import styles from "./Timer.module.css";
import { formatTime } from "../utils/time";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CustomPopUp from "./CustomPopUp";

const STORAGE_KEY = "timerStartTimestamp";

const Timer = forwardRef(function Timer(
  { running, seconds, setSeconds, resetWorkout },
  ref
) {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const intervalRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getSeconds: () => seconds,
  }));

  useEffect(() => {
    if (running) {
      let startTimestamp = localStorage.getItem(STORAGE_KEY);

      if (!startTimestamp) {
        startTimestamp = Date.now();
        localStorage.setItem(STORAGE_KEY, startTimestamp);
      }

      const updateElapsed = () => {
        const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
        setSeconds(elapsed);
      };

      updateElapsed();

      intervalRef.current = setInterval(() => {
        updateElapsed();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      localStorage.removeItem(STORAGE_KEY);
    }

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
    if (resetWorkout) resetWorkout();
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
});

export default Timer;
