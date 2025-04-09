"use client";

import React, { useEffect, useRef } from "react";
import loader from "@/utils/googleMapsLoader";

const LocationAccess = () => {
  const mapRef = useRef();
  useEffect(() => {
    // setIsMapLoading(true);
    // if (ALL_DISTRICTS.length > 0) {
    loader.importLibrary("maps").then(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // setCurLoc({ latitude, longitude });

            const currentLocation = new window.google.maps.LatLng(
              latitude,
              longitude
            );

            // console.log("latitude", latitude);
            // console.log("longitude", longitude);

            const mapOptions = {
              center: currentLocation,
              zoom: 16,
            };

            const newMap = new window.google.maps.Map(
              mapRef.current,
              mapOptions
            );

            // setCurrentPosition(currentLocation); // Set initial position
            // setMap(newMap);

            // Add event listeners to detect when the map is moving
            // newMap.addListener("dragstart", () => setIsMapMoving(true));
            // newMap.addListener("dragend", () => setIsMapMoving(false));

            // Reverse geocode current location
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { location: currentLocation },
              (results, status) => {
                if (status === "OK" && results[0]) {
                  // console.log("Current Location Details:", results[0]);

                  const addressComponents = results[0].address_components;
                  const getAddressPart = (type) =>
                    addressComponents.find((component) =>
                      component.types.includes(type)
                    )?.long_name;

                  const district = getAddressPart(
                    "administrative_area_level_2"
                  );
                  const city =
                    getAddressPart("locality") || getAddressPart("political");
                  const country = getAddressPart("country");

                  // let searchInfo = ALL_DISTRICTS.filter(
                  //   (info) =>
                  //     info.district_name
                  //       .toLowerCase()
                  //       .includes(district?.split(" ")[0].toLowerCase()) ||
                  //     info.district_name.match(
                  //       new RegExp(district?.split(" ")[0], "ui")
                  //     ) // Case-insensitive, Unicode search
                  // );

                  // setSearchInfo(searchInfo);

                  // console.log("Current Location District:", district);
                  // console.log("Current Location City:", city);
                  // console.log("Current Location Country:", country);
                } else {
                  // console.error("Geocoder failed:", status);
                }
              }
            );
          }
          // () => {
          //   alert("Unable to fetch your location");
          // }
        );
      }
      // setIsMapLoading(false);
    });
    // .catch((error) => {
    //   setIsMapLoading(false);
    //   console.error("Error loading Google Maps Library:", error);
    // });
    // }
  }, []);
  // useEffect(() => {
  //   loader
  //     .importLibrary("maps")
  //     .then(() => {
  //       if (navigator.geolocation) {
  //         navigator.geolocation.getCurrentPosition(
  //           (position) => {
  //             const { latitude, longitude } = position.coords;

  //             const currentLocation = new window.google.maps.LatLng(
  //               latitude,
  //               longitude
  //             );

  //             // console.log("latitude", latitude);
  //             // console.log("longitude", longitude);
  //           },
  //           () => {
  //             alert("Unable to fetch your location");
  //           }
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error loading Google Maps Library:", error);
  //     });
  //   // }
  // }, []);

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
