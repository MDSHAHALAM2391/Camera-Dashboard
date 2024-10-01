import React, { useState, useEffect } from "react";
import axios from "axios";
import Endpoints from "../API";
import Filter from "./Filter";
import Pagination from "./Pagination";
import "../styles/CameraDashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from "@mui/icons-material/Search";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";
import StorageIcon from "@mui/icons-material/Storage";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function CameraDashboard() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdown] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedCameras, setSelectedCameras] = useState([]);

  const fetchCameras = async () => {
    setLoading(true);
    try {
      const response = await axios.get(Endpoints.CameraList, {
        headers: {
          Authorization: `Bearer ${Endpoints.token}`,
        },
      });
      console.log("Response ===>>>", response);

      const cameraData = response.data.data;
      setCameras(cameraData);
      setLoading(false);

      const uniqueLocations = [
        ...new Set(cameraData.map((camera) => camera.location)),
      ];
      const uniqueStatuses = [
        ...new Set(cameraData.map((camera) => camera.status)),
      ];
      setLocations(uniqueLocations.filter(Boolean));
      setStatuses(uniqueStatuses.filter(Boolean));
    } catch (error) {
      console.log("Error while fetching camera ===>>>", error);
      toast.error("Failed to Load Camera List.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const deleteCamera = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this camera ?"
    );
    if (!confirmDelete) return;

    try {
      await axios.put(
        Endpoints.updateStatus,
        { id: id, status: "Inactive" },
        {
          headers: {
            Authorization: `Bearer ${Endpoints.token}`,
          },
        }
      );
      await fetchCameras();
    } catch (error) {
      console.log("Error while deleting camera =====>> ", error);
      toast.error("Failed to Delete the Camera.");
    }
  };

  const filteredCameras = cameras.filter((camera) => {
    const matchesSearchTerm = [
      camera.name,
      camera.location,
      camera.recorder,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = selectedLocation
      ? camera.location === selectedLocation
      : true;
    const matchesStatus = selectedStatus
      ? camera.status === selectedStatus
      : true;

    return matchesSearchTerm && matchesLocation && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCameras = filteredCameras.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCameras(currentCameras.map((camera) => camera.id));
    } else {
      setSelectedCameras([]);
    }
  };

  const handleSelectCamera = (id) => {
    if (selectedCameras.includes(id)) {
      setSelectedCameras(selectedCameras.filter((cameraId) => cameraId !== id));
    } else {
      setSelectedCameras([...selectedCameras, id]);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="camera-dashboard">
        <header className="dashboard-header">
          <img
            src="https://mma.prnewswire.com/media/1560916/Wobot_ai_Logo.jpg?p=facebook"
            alt="wobot.ai"
            className="logo"
          />
        </header>

        <div className="d-flex justify-content-between">
          <div>
            <h2>Cameras</h2>
            <p>Manage your cameras here:</p>
          </div>
          <div className="search-container">
            <input
              className="search-bar"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="search-icon" />
          </div>
        </div>

        <Filter
          locations={locations}
          statuses={statuses}
          selectedLocation={selectedLocation}
          selectedStatus={selectedStatus}
          setSelectedLocation={setSelectedLocation}
          setSelectedStatus={setSelectedStatus}
        />

        <table className="camera-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    currentCameras.length > 0 &&
                    selectedCameras.length === currentCameras.length
                  }
                />
              </th>
              <th>NAME</th>
              <th>HEALTH</th>
              <th>LOCATION</th>
              <th>RECORDER</th>
              <th>TASKS</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="loading-cell">
                  {" "}
                  <div className="d-flex justify-content-center align-items-center">
                    <strong>Loading cameras...</strong>
                  </div>
                </td>
              </tr>
            ) : (
              currentCameras.map((camera, index) => (
                <tr key={index} className="camera-row">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCameras.includes(camera.id)}
                      onChange={() => handleSelectCamera(camera.id)}
                    />
                  </td>
                  <td>
                    <div className="name-wrapper">
                      <span
                        className={
                          camera.id === 3 ? "status-circlered" : "status-circle"
                        }
                      ></span>
                      {camera.name ? camera.name : "N/A"}
                      {camera.id === 1 || camera.id === 8 ? (
                        <ErrorOutlineIcon color="warning" fontSize="small" />
                      ) : null}
                    </div>
                  </td>

                  <td>
                    <div className="health-indicator">
                      <FilterDramaIcon color="disabled" />
                      <div
                        className={`icon cloud ${
                          camera.health.cloud === "A" ? "status-a" : "status-b"
                        }`}
                      >
                        {camera.health.cloud}
                      </div>
                      <StorageIcon color="disabled" />
                      <div
                        className={`icon device ${
                          camera.health.device === "A" ? "status-a" : "status-b"
                        }`}
                      >
                        {camera.health.device}
                      </div>
                    </div>
                  </td>

                  <td>{camera.location ? camera.location : "N/A"}</td>
                  <td>{camera.recorder ? camera.recorder : "N/A"}</td>
                  <td>{camera.tasks ? `${camera.tasks} Tasks` : "N/A"}</td>
                  <td
                    className={`camera-status ${camera.status.toLowerCase()}`}
                  >
                    {camera.status ? camera.status : "N/A"}
                  </td>
                  <td>
                    <div
                      className="delete-button"
                      onClick={() => deleteCamera(camera.id)}
                    >
                      <NotInterestedIcon color="disabled" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination-container">
          <div className="pagination-info">
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="items-per-page-dropdown"
            >
              {dropdown.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span>
              {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredCameras.length)} of{" "}
              {filteredCameras.length}
            </span>

            <Pagination
              totalItems={filteredCameras.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CameraDashboard;
