import React, { useState } from "react";
import "./CommentForm.css";

function CommentForm({ postId }) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log("New comment:", comment, "for post:", postId);
      setComment("");
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="comment-form__input-container">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Viết bình luận..."
          className="comment-form__input"
        />
        <button
          type="submit"
          className="comment-form__submit-btn"
          disabled={!comment.trim()}
        >
          Gửi
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
