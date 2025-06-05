import React from "react";
import "./Sidebar.css";
import UserList from "./UserList";

function Sidebar() {
  return (
    <div className="sidebar">
      <UserList />
    </div>
  );
}

export default Sidebar;
