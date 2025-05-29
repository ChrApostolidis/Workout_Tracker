import { useEffect, useRef, useState } from "react";
import styles from "./Timer.module.css"

export default function Timer({ running, onStop }) {
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

  // Format seconds to hh:mm:ss
  const formatTime = (s) => {
    const hrs = String(Math.floor(s / 3600)).padStart(2, "0");
    const min = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${hrs}:${min}:${sec}`;
  };

  return (
    <div className={styles.timerContainer}>
      <span>{formatTime(seconds)}</span>
    </div>
  );
}