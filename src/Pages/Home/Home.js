import React, { useState, useEffect } from "react";
import "./Home.css";
import UserList from "../../Components/Layout/Sidebar/UserList";
import PostList from "../../Components/Post/PostList/PostList";
import PostDetail from "../../Components/Post/PostDetail/PostDetail";
import CreatePost from "../../Components/Post/CreatePost/CreatePost";

function Home({ user: propUser, onLogout }) {
  const [user, setUser] = useState(propUser);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [posts, setPosts] = useState([]);
  console.log("🚀 ~ Home ~ posts:", posts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // API để lấy danh sách bài viết
  const getPhotos = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setPosts([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8081/api/photo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải bài viết");
      }

      const data = await response.json();

      // Transform API data thành format component cần
      const transformedPosts = data.map((photo, index) => ({
        id: photo._id,
        caption: `Bài viết của ${photo.user.name}`,
        image: `http://localhost:8081/uploads/${photo.file_name}`,
        author: {
          id: photo.user.user_id,
          name: photo.user.name,
          name2: photo.user.name2,
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        comments: photo.comments.map((comment, commentIndex) => ({
          id: commentIndex + 1,
          content: comment.comment,
          author: comment.user.name,
          date: comment.date_time,
        })),
      }));

      setPosts(transformedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      setError("Không thể tải bài viết. Vui lòng thử lại!");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cập nhật user từ props hoặc localStorage
    if (propUser) {
      setUser(propUser);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }

    // Load posts từ API
    getPhotos();
  }, [propUser]);

  const handleLogin = (userData) => {
    setUser(userData);
    // Reload posts after login
    getPhotos();
  };

  const handleLogout = () => {
    setUser(null);
    setPosts([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) {
      onLogout();
    }
  };

  const handleOpenPostDetail = (post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const handleClosePostDetail = () => {
    setShowPostDetail(false);
    setSelectedPost(null);
  };

  const handleCreatePost = () => {
    getPhotos();
  };

  const handleCommentAdded = () => {
    getPhotos();
  };

  return (
    <div className="home">
      <div className="home__content">
        <div className="home__sidebar">{user && <UserList />}</div>

        <div className="home__main">
          <CreatePost user={user} onCreatePost={handleCreatePost} />

          {loading && (
            <div className="home__loading">
              <p>Đang tải bài viết...</p>
            </div>
          )}

          {error && (
            <div className="home__error">
              <p>{error}</p>
              <button onClick={getPhotos} className="home__retry-btn">
                Thử lại
              </button>
            </div>
          )}

          {!loading && !error && (
            <PostList posts={posts} onOpenPostDetail={handleOpenPostDetail} />
          )}
        </div>

        <div className="home__right"></div>
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

export default Home;
