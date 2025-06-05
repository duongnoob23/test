import React from "react";
import "./PostList.css";
import PostCard from "../PostCard/PostCard";

function PostList({ posts, onOpenPostDetail }) {
  return (
    <div className="post-list">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onOpenPostDetail={onOpenPostDetail}
          />
        ))
      ) : (
        <div className="post-list__empty">
          <p>Chưa có bài viết nào</p>
        </div>
      )}
    </div>
  );
}

export default PostList;
