import React, { useState } from "react";
import "./PostDetail.css";
import Modal from "../../Common/Modal/Modal";

function PostDetail({ post, onClose, onCommentAdded }) {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  // API để thêm comment
  const addComment = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user.id) {
      alert("Vui lòng đăng nhập để comment!");
      return;
    }

    if (!newComment.trim()) {
      alert("Vui lòng nhập nội dung comment!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8081/api/photo/comments/${post.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            comment: newComment.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể thêm comment");
      }

      console.log("Comment thành công");

      // Reset form
      setNewComment("");

      // Callback để reload lại trang Home
      if (onCommentAdded) {
        onCommentAdded(); // Không truyền tham số, chỉ signal để reload
      }

      // Đóng modal sau khi comment thành công
      onClose();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Không thể thêm comment. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addComment();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="post-detail">
        <div className="post-detail__content">
          <div className="post-detail__image">
            <img src={post.image} alt={post.caption} />
          </div>

          <div className="post-detail__sidebar">
            <div className="post-detail__header">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="post-detail__author-avatar"
              />
              <div className="post-detail__author-info">
                <span className="post-detail__author-name">
                  {post.author.name}
                </span>
              </div>
            </div>

            <div className="post-detail__caption">
              <p>{post.caption}</p>
            </div>

            <div className="post-detail__comments">
              <div className="post-detail__comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="post-detail__comment">
                    <div className="post-detail__comment-header">
                      <span className="post-detail__comment-author">
                        {comment.author}
                      </span>
                      <span className="post-detail__comment-date">
                        {new Date(comment.date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="post-detail__comment-content">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="post-detail__comment-form">
              <div className="post-detail__comment-input-wrapper">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Viết bình luận..."
                  className="post-detail__comment-input"
                  rows="2"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="post-detail__comment-submit"
                  disabled={loading || !newComment.trim()}
                >
                  {loading ? "Đang gửi..." : "Gửi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PostDetail;
