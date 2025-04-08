"use client";

import React from "react";
import { useEffect, useState } from "react";

const LocationAccess = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  return (
    <>
      {/* {location ? (
        <p className="text-center">
          Your location: Latitude {location.lat}, Longitude {location.lng}
        </p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p className="text-center">Requesting location permission...</p>
      )} */}
    </>
  );
};

export default LocationAccess;
