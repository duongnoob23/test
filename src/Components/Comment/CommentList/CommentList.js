import React from "react";
import "./CommentList.css";
import CommentItem from "../CommentItem/CommentItem";

function CommentList({ comments }) {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

export default CommentList;
