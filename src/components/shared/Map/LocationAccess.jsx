"use client";

import React, { useEffect } from "react";
import loader from "@/utils/googleMapsLoader";

const LocationAccess = () => {
  useEffect(() => {
    loader
      .importLibrary("maps")
      .then(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;

              const currentLocation = new window.google.maps.LatLng(
                latitude,
                longitude
              );

              // console.log("latitude", latitude);
              // console.log("longitude", longitude);
            },
            () => {
              alert("Unable to fetch your location");
            }
          );
        }
      })
      .catch((error) => {
        console.error("Error loading Google Maps Library:", error);
      });
    // }
  }, []);

  return <></>;
};

export default LocationAccess;

// "use client";

// import React from "react";
// import { useEffect, useState } from "react";

// const LocationAccess = () => {
//   const [location, setLocation] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (err) => {
//           setError(err.message);
//         }
//       );
//     } else {
//       setError("Geolocation is not supported by your browser");
//     }
//   }, []);

//   return (
//     <>
//       {/* {location ? (
//         <p className="text-center">
//           Your location: Latitude {location.lat}, Longitude {location.lng}
//         </p>
//       ) : error ? (
//         <p>Error: {error}</p>
//       ) : (
//         <p className="text-center">Requesting location permission...</p>
//       )} */}
//     </>
//   );
// };

// export default LocationAccess;
