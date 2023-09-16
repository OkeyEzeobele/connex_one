import React, { useEffect, useState } from "react";
import api from "./api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [serverTime, setServerTime] = useState(null);
  const [clientTime, setClientTime] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [timeDiff, setTimeDiff] = useState("00:00:00");

  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${remainingSeconds}`;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const currentTime = Math.floor(Date.now() / 1000);
      setClientTime(currentTime);

      const timeResponse = await api.get("/time", {
        headers: { Authorization: "mysecrettoken" },
      });
      setServerTime(timeResponse.data.epoch);

      const diffInSeconds = Math.abs(currentTime - timeResponse.data.epoch);
      setTimeDiff(formatTime(diffInSeconds));

      // toast.success("Successfully fetched server time");

      const metricsResponse = await api.get("/metrics", {
        headers: { Authorization: "mysecrettoken" },
      });
      setMetrics(metricsResponse.data);
      // toast.success("Successfully fetched metrics");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(`Error fetching data: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (serverTime && clientTime) {
        const newDiff = Math.abs(serverTime - Math.floor(Date.now() / 1000));
        setTimeDiff(formatTime(newDiff));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [serverTime, clientTime]);

  return (
    <div className="App" style={{ paddingTop: 30 }}>
      <ToastContainer />
      <div className="left-panel">
        <h1>Server Time</h1>
        {!isLoading ? <p>{serverTime}</p> : <p>Loading...</p>}

        <h1>Time Difference</h1>
        {!isLoading ? <p>{timeDiff}</p> : <p>Loading...</p>}
      </div>
      <div className="right-panel">
        <h1>Metrics</h1>
        {!isLoading ? <pre>{metrics}</pre> : <h2>Loading...</h2>}
      </div>
    </div>
  );
}

export default App;
