import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [serverTime, setServerTime] = React.useState(null);
  const [metrics, setMetrics] = React.useState(null);
  const [timeDiff, setTimeDiff] = React.useState("00:00:00");

  const fetchData = async () => {
    try {
      const timeResponse = await axios.get("http://localhost:3000/time", {
        headers: { Authorization: "mysecrettoken" },
      });
      setServerTime(timeResponse.data.epoch);
      toast.success("Successfully fetched server time");

      const metricsResponse = await axios.get("http://localhost:3000/metrics", {
        headers: { Authorization: "mysecrettoken" },
      });
      setMetrics(metricsResponse.data);
      toast.success("Successfully fetched metrics");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(`Error fetching data: ${error.message}`);
    }
  };

  React.useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App" style={{ paddingTop: 30 }}>
      <ToastContainer />
      <div className="left-panel">
        <h1>Server Time</h1>
        <p>{serverTime || "Loading..."}</p>
        <h1>Time Difference</h1>
        <p>{timeDiff}</p>
      </div>
      <div className="right-panel">
        <h1>Metrics</h1>
        <pre>{metrics || "Loading..."}</pre>
      </div>
    </div>
  );
}

export default App;
