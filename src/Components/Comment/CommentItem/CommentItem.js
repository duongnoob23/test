import React from "react";
import "./CommentItem.css";

function CommentItem({ comment }) {
  return (
    <div className="comment-item">
      <div className="comment-item__avatar">
        <img
          src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&sig=${comment.id}`}
          alt={comment.author}
          className="comment-item__avatar-img"
        />
      </div>
      <div className="comment-item__content">
        <div className="comment-item__bubble">
          <span className="comment-item__author">{comment.author}</span>
          <p className="comment-item__text">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
