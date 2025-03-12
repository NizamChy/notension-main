"use client";

import axios from "axios";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import loader from "@/utils/googleMapsLoader";
import { useState, useEffect, useRef } from "react";
import { handleUserReducer } from "@/redux/userReducer";
import { ALL_DISTRICTS_URL } from "@/api-endpoints/secret";

const Map = ({ onCloseModal }) => {
  const [map, setMap] = useState(null);
  const [error, setError] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [searchInfo, setSearchInfo] = useState([]);
  const [isMapMoving, setIsMapMoving] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [curLoc, setCurLoc] = useState({ latitude: null, longitude: null });

  const router = useRouter();
  const inputRef = useRef();
  const mapRef = useRef();
  const markerRef = useRef();
  const dispatch = useDispatch();

  let userLocation = {
    setCurrentLocation: false,
    userLatitude: curLoc?.latitude,
    userLongitude: curLoc?.longitude,
    districtId: searchInfo[0]?._id,
    districtName: searchInfo[0]?.district_name,
    districtAreaId: "00",
    districtAreaName: "",
    districtSubAreaId: "00",
    districtSubAreaName: "",
    // formatted_address: formatted_address,
  };

  const fetchAllDistricts = async () => {
    try {
      const response = await axios.get(ALL_DISTRICTS_URL, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching districts:", error);
      throw error.response ? error.response.data : error.message;
    }
  };

  const handleConfirmLocation = () => {
    if (searchInfo && curLoc) {
      dispatch(
        handleUserReducer({
          type: "SAVE_USER_CURRENT_LOCATION",
          data: userLocation,
        })
      );
    }

    onCloseModal();

    router.push("/");
  };

  const handleConfirmMobileLocation = () => {
    if (searchInfo && curLoc) {
      dispatch(
        handleUserReducer({
          type: "SAVE_USER_CURRENT_LOCATION",
          data: userLocation,
        })
      );
    }

    router.push("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllDistricts();
        setDistricts(data?.result);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  // console.log("curLoc:", curLoc);
  // console.log("all districts:", districts);
  // console.log("userLocation:", userLocation);
  // console.log("currentUserLocation from redux:", currentUserLocation);

  useEffect(() => {
    if (districts.length > 0) {
      loader
        .importLibrary("maps")
        .then(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;

                setCurLoc({ latitude, longitude });

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

                setCurrentPosition(currentLocation); // Set initial position
                setMap(newMap);

                // Add event listeners to detect when the map is moving
                newMap.addListener("dragstart", () => setIsMapMoving(true));
                newMap.addListener("dragend", () => setIsMapMoving(false));

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
                        getAddressPart("locality") ||
                        getAddressPart("political");
                      const country = getAddressPart("country");

                      let searchInfo = districts.filter(
                        (info) =>
                          info.district_name
                            .toLowerCase()
                            .includes(district?.split(" ")[0].toLowerCase()) ||
                          info.district_name.match(
                            new RegExp(district?.split(" ")[0], "ui")
                          ) // Case-insensitive, Unicode search
                      );

                      setSearchInfo(searchInfo);

                      // console.log("Current Location District:", district);
                      // console.log("Current Location City:", city);
                      // console.log("Current Location Country:", country);
                    } else {
                      // console.error("Geocoder failed:", status);
                    }
                  }
                );
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
    }
  }, [districts]);

  useEffect(() => {
    if (map) {
      const centerChangedListener = map.addListener("center_changed", () => {
        const center = map.getCenter();
        const latitude = center.lat();
        const longitude = center.lng();

        if (markerRef.current) {
          markerRef.current.setPosition(center);
        }

        setCurLoc({ latitude, longitude });
      });

      return () =>
        window.google.maps.event.removeListener(centerChangedListener);
    }
  }, [map]);

  useEffect(() => {
    if (map && inputRef.current) {
      const chattogramBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(22.2469, 91.7832),
        new window.google.maps.LatLng(22.45, 91.8325)
      );

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["geometry", "address_components", "name"],
          componentRestrictions: { country: "BD" },
        }
      );

      autocomplete.setBounds(chattogramBounds);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (place.geometry && place.geometry.location) {
          const location = place.geometry.location;

          const latitude = location.lat();
          const longitude = location.lng();

          // Update map center
          map.setCenter(location);
          map.setZoom(18);

          // console.log("Searched Location Details:", place);

          const addressComponents = place.address_components;
          const getAddressPart = (type) =>
            addressComponents.find((component) =>
              component.types.includes(type)
            )?.long_name;

          const district = getAddressPart("administrative_area_level_2");
          const city =
            getAddressPart("locality") || getAddressPart("political");
          const country = getAddressPart("country");

          // console.log("Searched Location District:", district);
          // console.log("Searched Location City:", city);
          // console.log("Searched Location Country:", country);

          setCurLoc({ latitude, longitude });

          const searchInfo = districts.filter(
            (info) =>
              info.district_name
                .toLowerCase()
                .includes(district?.split(" ")[0].toLowerCase()) ||
              info.district_name.match(
                new RegExp(district?.split(" ")[0], "ui")
              )
          );

          setSearchInfo(searchInfo);
        } else {
          alert("Location details not found.");
        }
      });
    }
  }, [map]);

  return (
    <div className="relative">
      <div style={{ marginBottom: "10px" }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search location"
          style={{ padding: "8px", marginBottom: "10px" }}
          className="w-full outline-none border"
        />
      </div>

      <div className="h-[80vh] md:h-[55vh] relative">
        {/* Google Map */}
        <div ref={mapRef} id="map" className="h-full w-full" />

        {/* Fixed Flag Image at the Center */}
        <Image
          src={isMapMoving ? "/png/moving-flag.png" : "/png/location-flag.png"}
          alt="Fixed Flag"
          width={40}
          height={40}
          className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-full pointer-events-none"
        />
      </div>

      <div className="hidden md:flex justify-center gap-2">
        <button
          onClick={handleConfirmLocation}
          className="rounded-md px-5 py-2 text-white text-xl font-medium bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition duration-300 w-full mt-3"
        >
          Confirm Location
        </button>
      </div>

      <div className="flex md:hidden justify-center gap-2">
        <button
          onClick={handleConfirmMobileLocation}
          className="rounded-md px-5 py-2 text-white text-xl font-medium bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition duration-300 w-full mt-3"
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};

export default Map;
