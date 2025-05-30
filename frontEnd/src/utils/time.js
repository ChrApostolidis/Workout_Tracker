// Format seconds to hh:mm:ss
export function formatTime(s) {
  const hrs = String(Math.floor(s / 3600)).padStart(2, "0");
  const min = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${hrs}:${min}:${sec}`;
}
