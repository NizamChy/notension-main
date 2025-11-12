"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import loader from "@/utils/googleMapsLoader";

const LocationAccess = () => {
  const { currentUserLocation } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUserLocation?.districtId) {
      loader.importLibrary("maps").then(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            const currentLocation = new window.google.maps.LatLng(
              latitude,
              longitude
            );

            const geocoder = new window.google.maps.Geocoder();
          });
        }
      });
    }
  }, []);

  return <></>;
};

export default LocationAccess;
