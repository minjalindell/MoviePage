import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/userContext";
import "./groups.css";

function Groups() {
  const [groups, setGroups] = useState([]); 
  const [groupName, setGroupName] = useState(""); 
  const { user } = useContext(UserContext);

  const fetchGroups = async () => {
    if (!user.token) {
      console.error("User is not authenticated.");
      return; 
    }

    try {
      const response = await axios.get("http://localhost:3001/groups", {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setGroups(response.data); 
    } catch (error) {
      console.error("Error fetching groups:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user.token]);

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      console.log('Creating group with name:', groupName);
      axios.post("http://localhost:3001/groups/new", { name: groupName, id: user.user_id }, {
        headers: {
          Authorization: `Bearer ${user.token}` 
        }
      })
      .then((response) => {
        console.log('Server response:', response.data);
        setGroups([...groups, response.data]); 
        setGroupName(""); 
      })
      .catch((error) => {
        console.error("Error creating group:", error.response?.data || error.message);
      });
    } else {
      alert("Please enter a group name.");
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
                   <li key={group.group_id}>{group.name}</li> 
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