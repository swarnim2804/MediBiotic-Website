import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './NearbyServices.css'; // Adjust the path if necessary


// Custom Icons
const hospitalIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const pharmacyIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/901/901350.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userLocationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/641/641989.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function NearbyServices() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [radius, setRadius] = useState(5000);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const debounceTimeout = useRef(null);

  // Get User's Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setError("Failed to get location. Please enable GPS.");
          console.error(error);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch Nearby Hospitals & Pharmacies
  useEffect(() => {
    if (latitude && longitude) {
      fetchNearbyPlaces();
    }
  }, [latitude, longitude, debouncedSearchQuery, selectedType, radius]);

  const fetchNearbyPlaces = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`, 
        {
          params: {
            q: debouncedSearchQuery || "hospital OR pharmacy",
            format: "json",
            addressdetails: 1,
            lat: latitude,
            lon: longitude,
            radius: radius,
            limit: 15,
            countrycodes: "IN",
          },
        }
      );
      const filteredPlaces = response.data.filter(place => 
        selectedType === 'all' || 
        (selectedType === 'hospital' && place.display_name.toLowerCase().includes("hospital")) ||
        (selectedType === 'pharmacy' && place.display_name.toLowerCase().includes("pharmacy"))
      );
      setPlaces(filteredPlaces);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Error fetching nearby services.");
      setLoading(false);
    }
  };

  // Handle Search Query Change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    clearTimeout(debounceTimeout.current);
    
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchQuery(value);
    }, 500);
  };

  // Handle "Enter" key press for immediate search
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setDebouncedSearchQuery(searchQuery);
    }
  };

  // Handle Type Filter Change
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  // Handle Radius Filter Change
  const handleRadiusChange = (event) => {
    setRadius(event.target.value);
  };

  return (
    <div className="nearby-services-container">
      <h2>🏥 Nearby Hospitals & Pharmacies</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p className="loading-text">Loading nearby services...</p>
      ) : latitude && longitude ? (
        <>
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              placeholder="Search for a hospital or pharmacy"
              className="border p-2 rounded"
            />
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="border p-2 ml-2 rounded"
            >
              <option value="all">All</option>
              <option value="hospital">Hospitals</option>
              <option value="pharmacy">Pharmacies</option>
            </select>
            <select
              value={radius}
              onChange={handleRadiusChange}
              className="border p-2 ml-2 rounded"
            >
              <option value="5000">5 km</option>
              <option value="10000">10 km</option>
              <option value="15000">15 km</option>
            </select>
          </div>

          <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[latitude, longitude]} icon={userLocationIcon}>
              <Popup>📍 You are here</Popup>
            </Marker>

            {places.map((place, index) => (
              <Marker
                key={index}
                position={[place.lat, place.lon]}
                icon={place.display_name.toLowerCase().includes("hospital") ? hospitalIcon : pharmacyIcon}
              >
                <Popup>
                  <strong>{place.display_name}</strong><br />
                  Latitude: {place.lat}<br />
                  Longitude: {place.lon}
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <ul className="mt-4">
            {places.map((place, index) => (
              <li key={index}>
                <h3>{place.display_name}</h3>
                <p>Latitude: {place.lat}, Longitude: {place.lon}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Waiting for location...</p>
      )}
    </div>
  );
}

export default NearbyServices;
