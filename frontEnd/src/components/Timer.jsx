import { useEffect, useRef, useState } from "react";
import styles from "./Timer.module.css";
import { formatTime } from "../utils/time";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CustomPopUp from "./CustomPopUp";

export default function Timer({ running, onStop }) {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
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

  const handleShowAlert = () => {
    setAlertMessage("Are you sure you want to go back? Your progress will be lost!");
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
