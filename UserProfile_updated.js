import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./UserProfile.css";
// Bỏ import Header vì đã được hiển thị ở AppLayout
// import Header from "../../Components/Layout/Header/Header";
import PostCard from "../../Components/Post/PostCard/PostCard";
import PostDetail from "../../Components/Post/PostDetail/PostDetail";

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // API để lấy bài viết của người dùng
  const getUserPosts = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserPosts([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8081/api/photo/photosOfUser/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải bài viết của người dùng");
      }

      const data = await response.json();

      // Transform API data
      const transformedPosts = data.map((photo) => ({
        id: photo._id,
        caption: `Bài viết được đăng lúc ${new Date(
          photo.date_time
        ).toLocaleDateString("vi-VN")}`,
        image: `http://localhost:8081/uploads/${photo.file_name}`,
        author: {
          id: photo.user_id,
          name: user ? user.name : "Người dùng",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        comments: photo.comments
          ? photo.comments.map((comment, commentIndex) => ({
              id: comment._id || commentIndex + 1,
              content: comment.comment,
              author: `${comment.user.first_name} ${comment.user.last_name}`,
              date: comment.date_time,
            }))
          : [],
      }));

      setUserPosts(transformedPosts);
    } catch (error) {
      console.error("Error loading user posts:", error);
      setError("Không thể tải bài viết của người dùng");
      setUserPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // API để lấy thông tin người dùng từ danh sách
  const getUserInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8081/api/user/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const users = await response.json();
        const foundUser = users.find((u) => u._id === userId);
        if (foundUser) {
          setUser({
            id: foundUser._id,
            name: `${foundUser.first_name} ${foundUser.last_name}`,
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          });
        }
      }
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  };

  useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // Load user info and posts
    getUserInfo();
    getUserPosts(userId);
  }, [userId]);

  useEffect(() => {
    // Load posts again when user info is loaded
    if (user) {
      getUserPosts(userId);
    }
  }, [user, userId]);

  const handleOpenPostDetail = (post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const handleClosePostDetail = () => {
    setShowPostDetail(false);
    setSelectedPost(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const handleCommentAdded = (postId, newComment) => {
    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  if (!user && !loading) {
    return (
      <div className="user-profile">
        {/* Bỏ Header vì đã được hiển thị ở AppLayout */}
        {/* <Header user={currentUser} onLogout={handleLogout} /> */}
        <div className="user-profile__content">
          <div className="user-profile__error">
            <p>Không tìm thấy người dùng</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      {/* Bỏ Header vì đã được hiển thị ở AppLayout */}
      {/* <Header user={currentUser} onLogout={handleLogout} /> */}

      <div className="user-profile__content">
        {user && (
          <div className="user-profile__header">
            <img
              src={user.avatar}
              alt={user.name}
              className="user-profile__avatar"
            />
            <div className="user-profile__info">
              <h1 className="user-profile__name">{user.name}</h1>
              <p className="user-profile__posts-count">
                {userPosts.length} bài viết
              </p>
            </div>
          </div>
        )}

        <div className="user-profile__posts">
          <h2 className="user-profile__posts-title">Bài viết</h2>

          {loading && (
            <div className="user-profile__loading">
              <p>Đang tải bài viết...</p>
            </div>
          )}

          {error && (
            <div className="user-profile__error">
              <p>{error}</p>
              <button
                onClick={() => getUserPosts(userId)}
                className="user-profile__retry-btn"
              >
                Thử lại
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="user-profile__posts-list">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onOpenPostDetail={handleOpenPostDetail}
                  />
                ))
              ) : (
                <p className="user-profile__no-posts">Chưa có bài viết nào</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showPostDetail && selectedPost && (
        <PostDetail
          post={selectedPost}
          onClose={handleClosePostDetail}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}

export default UserProfile;
