import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/userContext";
import "./groups.css";
import { useNavigate } from "react-router-dom";
 
function Groups() {
  const [userGroups, setUserGroups] = useState([]);  // Käyttäjän omat ryhmät
  const [allGroups, setAllGroups] = useState([]);    // Kaikki ryhmät
  const [groupName, setGroupName] = useState("");     // Uuden ryhmän nimi
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
 
  // Haetaan käyttäjän omat ryhmät
  const fetchUserGroups = async () => {
    if (!user.token) {
      return; // Ei haeta käyttäjän omia ryhmiä, jos ei ole kirjautunut
    }
 
    try {
      const response = await axios.get("http://localhost:3001/groups", {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setUserGroups(response.data); // Asetetaan omat ryhmät tilaan
    } catch (error) {
      console.error("Error fetching user groups:", error.response?.data || error.message);
    }
  };
 
  // Haetaan kaikki ryhmät (koko tietokannan ryhmät)
  const fetchAllGroups = async () => {
    try {
      const response = await axios.get("http://localhost:3001/groups/all");  // Tämä reitti on lisättävä palvelimelle
      setAllGroups(response.data); // Asetetaan kaikki ryhmät tilaan
    } catch (error) {
      console.error("Error fetching all groups:", error.response?.data || error.message);
    }
  };
 
  useEffect(() => {
    fetchAllGroups(); // Haetaan kaikki ryhmät aina, riippumatta kirjautumisesta
    if (user.token) {
      fetchUserGroups(); // Haetaan käyttäjän omat ryhmät vain, jos käyttäjä on kirjautunut
    }
  }, [user.token]);
 
  const handleCreateGroup = () => {
    if (groupName.trim()) {
      console.log("Creating group with name:", groupName);
      axios
        .post(
          "http://localhost:3001/groups/new",
          { name: groupName, id: user.user_id },
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        )
        .then((response) => {
          console.log("Server response:", response.data);
          setUserGroups([...userGroups, response.data]);
          setGroupName("");
        })
        .catch((error) => {
          console.error("Error creating group:", error.response?.data || error.message);
        });
    } else {
      alert("Please enter a group name.");
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`); // Navigoi ryhmän sivulle
  };
 
  return (
    <div className="groups-container">
      <h1>Groups</h1>
 
      <div className="groups-wrapper">
        {/* Näytetään käyttäjän omat ryhmät, jos käyttäjä on kirjautunut */}
        {user.token && (
          <div className="group-list">
            <h2>Your Groups</h2>
            {userGroups.length === 0 ? (
              <p>No groups found.</p>
            ) : (
              <ul>
                {userGroups.map((group) => (
                  <li key={group.group_id}>
                    <button onClick={() => handleGroupClick(group.group_id)}>
                      {group.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
 
        {/* Kaikki ryhmät näytetään aina */}
        <div className="group-list">
          <h2>All Groups</h2>
          {allGroups.length === 0 ? (
            <p>No groups found.</p>
          ) : (
            <ul>
              {allGroups.map((group) => (
                <li key={group.group_id}>
                  <button onClick={() => handleGroupClick(group.group_id)}>
                  {group.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
 
      {/* Uuden ryhmän luominen */}
      {user.token && (
        <div className="input-container">
          <h2>Create New Group</h2>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
          />
          <button className="create-group-button" onClick={handleCreateGroup}>
            Create Group
          </button>
        </div>
      )}
    </div>
  );
}
 
export default Groups;