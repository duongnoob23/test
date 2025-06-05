import React from "react";
import "./PostCard.css";

function PostCard({ post, onOpenPostDetail }) {
  const handleCommentClick = () => {
    onOpenPostDetail(post);
  };

  return (
    <div className="post-card">
      <div className="post-card__header">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="post-card__author-avatar"
        />
        <span className="post-card__author-name">{post.author.name}</span>
      </div>
      <div className="post-card__content">
        <p className="post-card__caption">{post.caption}</p>

        <img src={post.image} alt="Post" className="post-card__image" />
      </div>

      <div className="post-card__actions">
        <button className="post-card__comment-btn" onClick={handleCommentClick}>
          💬 Bình luận ({post.comments.length})
        </button>
      </div>
    </div>
  );
}

export default PostCard;
