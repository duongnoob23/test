import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "../styles.css";
import Header from "../Components/Layout/Header/Header";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import UserProfile from "../Pages/UserProfile/UserProfile";
import NoMatch from "../Pages/NotFound/NoMatch";
import Posts from "../Pages/Post/Posts";
import Post from "../Pages/Post/Post";
import PostLists from "../Pages/Post/PostLists";
import Stats from "../Stats";
import NewPost from "../Pages/Post/NewPost";
import ProtectedRoute from "../Routes/ProtectedRoute";

function AppLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra user từ localStorage khi component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function handleLogin(userData) {
    setUser(userData);
  }

  function logOut() {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <>
      {/* Header luôn hiển thị ở tất cả các trang */}
      <Header user={user} onLogin={handleLogin} onLogout={logOut} />
      
      <Routes>
        {/* Các trang không cần đăng nhập */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        
        {/* Tất cả các trang khác đều được bọc trong ProtectedRoute */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Home user={user} onLogout={logOut} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/posts"
          element={
            <ProtectedRoute user={user}>
              <Posts />
            </ProtectedRoute>
          }
        >
          <Route index element={<PostLists />} />
          <Route path=":slug" element={<Post />} />
        </Route>
        
        <Route
          path="/about"
          element={
            <ProtectedRoute user={user}>
              <About />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute user={user}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/stats"
          element={
            <ProtectedRoute user={user}>
              <Stats user={user} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/newpost"
          element={
            <ProtectedRoute user={user}>
              <NewPost />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="*"
          element={
            <ProtectedRoute user={user}>
              <NoMatch />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default AppLayout;
