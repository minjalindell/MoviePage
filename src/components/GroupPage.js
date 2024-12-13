import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./GroupPage.css";
import { UserContext } from "./context/userContext";

const GroupPage = () => {
  const { groupId } = useParams(); // Hakee ryhmän ID:n URL-reitistä
  const { user } = useContext(UserContext); // Käyttäjän tiedot kontekstista
  const navigate = useNavigate(); // Navigointi
  const [groupInfo, setGroupInfo] = useState(null); // Tallentaa ryhmän tiedot
  const [isMember, setIsMember] = useState(false); // Käyttäjän jäsenyystila
  const [isAdmin, setIsAdmin] = useState(false); // Onko käyttäjä ylläpitäjä
  const [error, setError] = useState(null); // Virhetilan hallinta
  const [loadingAction, setLoadingAction] = useState(false); // Estää useat samanaikaiset pyynnöt

  // Hakee ryhmän tiedot ja tarkistaa jäsenyystilan
  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/groups/${groupId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const data = response.data;
        setGroupInfo(data);
        setIsMember(data.members?.some((member) => member.user_id === user.id) || false);
        setIsAdmin(data.admin_id === user.id);
      } catch (error) {
        console.error("Error fetching group info:", error);
        setError("Failed to load group information. Please try again later.");
      }
    };

    fetchGroupInfo();
  }, [groupId, user.token, user.id]);

  // Käsittelee ryhmään liittymisen
  const handleJoinGroup = async () => {
    if (loadingAction) return; // Estää useat pyynnöt
    setLoadingAction(true);
    try {
      await axios.post(
        `http://localhost:3001/groups/${groupId}/join`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setIsMember(true);
    } catch (error) {
      console.error("Error joining group:", error);
      setError("Failed to join the group. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  // Käsittelee ryhmästä poistumisen
  const handleLeaveGroup = async () => {
    if (loadingAction) return;
    setLoadingAction(true);
    try {
      await axios.post(
        `http://localhost:3001/groups/${groupId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setIsMember(false);
    } catch (error) {
      console.error("Error leaving group:", error);
      setError("Failed to leave the group. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  // Käsittelee ryhmän poistamisen
  const handleDeleteGroup = async () => {
    if (loadingAction) return;
    setLoadingAction(true);
    try {
      await axios.delete(`http://localhost:3001/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate("/groups"); // Siirtyy ryhmien listaukseen
    } catch (error) {
      console.error("Error deleting group:", error);
      setError("Failed to delete the group. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  // Näyttää lataustekstin, kunnes ryhmän tiedot on haettu
  if (!groupInfo && !error) {
    return <p>Loading group information...</p>;
  }

  // Näyttää virheviestin, jos tietojen haku epäonnistui
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="group-page-container">
      <h1 className="group-page-header">{groupInfo.name}</h1>
      <h2>Members:</h2>
      <ul className="members-list">
        {groupInfo.members?.map((member) => (
          <li key={member.user_id}>
            {member.name} ({member.role})
          </li>
        ))}
      </ul>
      <div className="button-container">
        {!isMember && (
          <button
            className="join-button"
            onClick={handleJoinGroup}
            disabled={loadingAction}
          >
            {loadingAction ? "Joining..." : "Join Group"}
          </button>
        )}
        {isMember && (
          <button
            className="leave-button"
            onClick={handleLeaveGroup}
            disabled={loadingAction}
          >
            {loadingAction ? "Leaving..." : "Leave Group"}
          </button>
        )}
        {isAdmin && (
          <button
            className="delete-button"
            onClick={handleDeleteGroup}
            disabled={loadingAction}
          >
            {loadingAction ? "Deleting..." : "Delete Group"}
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
