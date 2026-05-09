import React, { useState, useEffect } from "react";
import axios from "axios";

const Location = () => {
  const [ip,      setIp]      = useState(null);
  const [geoData, setGeoData] = useState(null);

  const fetchIpAddress = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      setIp(response.data.ip);
    } catch (error) {
      console.error("Error fetching IP address:", error.message);
    }
  };

const getGeoLocationData = async () => {
  if (!ip) return;
  try {
    const response = await axios.get(
      `https://geo.ipify.org/api/v2/country?apiKey=${process.env.REACT_APP_IPIFY_KEY}&ipAddress=${ip}`
    );
    setGeoData(response.data);
  } catch (error) {
    console.error("Error fetching geolocation data:", error.message);
  }
};

  useEffect(() => {
    fetchIpAddress();
  }, []);

  useEffect(() => {
    if (ip) getGeoLocationData();
  }, [ip]);

  return (
    <div className="location-wrap">
      {geoData && (
        <>
          <div className="location-item">
            <span className="location-label">Country</span>
            <span className="location-value">{geoData.location.country}</span>
          </div>
          <div className="location-item">
            <span className="location-label">Region</span>
            <span className="location-value">{geoData.location.region}</span>
          </div>
        </>
      )}
      {!geoData && ip && (
        <div className="location-item">
          <span className="location-value">Loading location…</span>
        </div>
      )}
    </div>
  );
};

export default Location;
