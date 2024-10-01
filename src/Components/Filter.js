import React from "react";
import "../styles/Filter.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RssFeedIcon from '@mui/icons-material/RssFeed';

function Filter({
  locations,
  statuses,
  selectedLocation,
  selectedStatus,
  setSelectedLocation,
  setSelectedStatus,
}) {
  return (
    <div className="filter-section">
    <div className="filter-container">
      <LocationOnIcon className="filter-icon" />
      <select
        className="filter-dropdown"
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
      >
        <option value="">Locations</option>
        {locations.map((location, index) => (
          <option key={index} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>
    <div className="filter-container">
      <RssFeedIcon className="filter-icon" />
      <select
        className="filter-dropdown"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">Status</option>
        {statuses.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  </div>
  
  );
}

export default Filter;
