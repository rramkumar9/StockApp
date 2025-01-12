// src/FetchApi.js
import { useEffect } from "react";

const FetchApi = ({ onDataReceived }) => {
  useEffect(() => {
    const fetchData = async () => {
      const apiUrl =
        "https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=2xivbA38mDbRAiqqE50J5CVENKMIIXc5";

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        onDataReceived(data, null); // Pass data back to parent component
      } catch (error) {
        onDataReceived(null, error); // Pass error back to parent component
      }
    };

    fetchData(); // Trigger API call on load
  }, [onDataReceived]);

  return null; // This component does not render anything
};

export default FetchApi;
