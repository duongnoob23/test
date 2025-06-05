import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserItem.css";

function UserItem({ user }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <div className="user-item" onClick={handleClick}>
      <img src={user.avatar} alt={user.name} className="user-item__avatar" />
      <span className="user-item__name">{user.name}</span>
    </div>
  );
}

export default UserItem;
