import "./styles.css";
import React from "react";
import { Navigate } from "react-router-dom";

function Stats({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Stats View</h2>
      </div>
      <div className="stats-content">
        <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
      </div>
    </div>
  );
}

export default Stats;
