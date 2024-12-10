import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./GroupPage.css";
import { UserContext } from "./context/userContext";

const GroupPage = () => {
  const { groupId } = useParams();
  const { user } = useContext(UserContext);
  const [groupInfo, setGroupInfo] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [joinRequestSent, setJoinRequestSent] = useState(false);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/groups/${groupId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setGroupInfo(response.data);
        setIsMember(response.data.isMember);
      } catch (error) {
        console.error("Error fetching group info:", error);
      }
    };

    fetchGroupInfo();
  }, [groupId, user.token]);

  const handleJoinRequest = async () => {
    try {
      await axios.post(
        `http://localhost:3001/groups/${groupId}/request`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setJoinRequestSent(true);
    } catch (error) {
      console.error("Error sending join request:", error);
    }
  };

  if (!groupInfo) {
    return <p>Loading group information...</p>;
  }

  return (
    <div className="group-page-container">
      <h1 className="group-page-header">{groupInfo.name}</h1>
      <h2>Members:</h2>
      <ul className="members-list">
        {groupInfo.members.map((member) => (
          <li key={member.user_id}>
            {member.name} ({member.role})
          </li>
        ))}
      </ul>
      {!isMember && !joinRequestSent && (
        <button className="request-button" onClick={handleJoinRequest}>Request to Join Group</button>
      )}
      {joinRequestSent && <p>Join request has been sent.</p>}
    </div>
  );
};

export default GroupPage;
