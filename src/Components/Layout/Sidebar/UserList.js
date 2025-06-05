import React, { useState, useEffect } from "react";
import "./UserList.css";
import UserItem from "../UserItem/UserItem";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // API để lấy danh sách người dùng
  const getUserList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8081/api/user/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách người dùng");
      }

      const data = await response.json();

      // Transform API data
      const transformedUsers = data.map((user) => ({
        id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Không thể tải danh sách người dùng");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  if (loading) {
    return (
      <div className="user-list">
        <h3 className="user-list__title">Danh sách liên hệ</h3>
        <div className="user-list__loading">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list">
        <h3 className="user-list__title">Danh sách liên hệ</h3>
        <div className="user-list__error">
          <p>{error}</p>
          <button onClick={getUserList} className="user-list__retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h3 className="user-list__title">Danh sách liên hệ</h3>
      <div className="user-list__items">
        {users.length > 0 ? (
          users.map((user) => <UserItem key={user.id} user={user} />)
        ) : (
          <p className="user-list__empty">Không có người dùng nào</p>
        )}
      </div>
    </div>
  );
}

export default UserList;
