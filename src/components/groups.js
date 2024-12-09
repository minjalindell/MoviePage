import React, { useState, useEffect } from "react";
import axios from "axios";
import "./groups.css";
 
function Groups() {
  const [groups, setGroups] = useState([]); // Tila ryhmien tallentamiseen
  const [groupName, setGroupName] = useState(""); // Tila ryhmän nimen tallentamiseen
 
  // Haetaan kaikki kirjautuneen käyttäjän ryhmät palvelimelta
  useEffect(() => {
    axios
      .get("http://localhost:3001/user/groups") // Päivitetty endpoint
      .then((response) => {
        setGroups(response.data); // Tallennetaan ryhmät tilaan
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
      });
  }, []); // Haetaan ryhmät vain kerran komponentin latauksen jälkeen
 
  // Uuden ryhmän luominen
  const handleCreateGroup = () => {
    if (groupName.trim()) {
      console.log('Creating group with name:', groupName);
      axios.post("http://localhost:3001/groups", { name: groupName })
        .then((response) => {
          console.log('Sent data', { name: groupName}); // Tarkista lähetetty data
          console.log('Server response:', response.data); // tarkista vastaus
          setGroups([...groups, response.data]); // Lisää uusi ryhmä listalle
          setGroupName(""); // Tyhjennä syöttökenttä ryhmän luomisen jälkeen
        })
        .catch((error) => {
          console.error("Error creating group:", error.response?.data || error.message); // Virheen käsittely
        });
    } else {
      alert("Please enter a group name."); // Virheilmoitus jos nimi on tyhjä
    }
  };
 
  return (
    <div className="groups-container">
      <h1>Groups</h1>
 
      <div className="groups-wrapper">
        {/* Käyttäjän omat ryhmät */}
        <div className="group-list">
          <h2>Your Groups</h2>
          {groups.length === 0 ? (
            <p>No groups found.</p>
          ) : (
            <ul>
              {groups.map((group) => (
                <li key={group.id}>{group.name}</li>
              ))}
            </ul>
          )}
        </div>
 
        {/* Kaikki ryhmät */}
        <div className="group-list">
          <h2>All Groups</h2>
          {groups.length === 0 ? (
            <p>No groups found.</p>
          ) : (
            <ul>
              {groups.map((group) => (
                <li key={group.id}>{group.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
 
      {/* Uuden ryhmän luominen */}
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
    </div>
  );
}
 
export default Groups;