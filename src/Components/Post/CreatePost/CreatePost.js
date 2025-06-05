import React, { useState } from "react";
import "./CreatePost.css";
import CreatePostModal from "../../Common/Modal/CreatePostModal";

function CreatePost({ user, onCreatePost }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitPost = (postData) => {
    onCreatePost(postData);
    setShowModal(false);
  };

  if (!user) return null;

  return (
    <>
      <div className="create-post">
        <div className="create-post__header">
          <img
            src={user.avatar}
            alt={user.firstname}
            className="create-post__avatar"
          />
          <div className="create-post__input" onClick={handleOpenModal}>
            {user.firstname} ơi, bạn đang nghĩ gì thế?
          </div>
        </div>

        <div className="create-post__actions">
          <div className="create-post__action" onClick={handleOpenModal}>
            <span className="create-post__icon">🖼️</span>
            <span className="create-post__text">Ảnh/video</span>
          </div>
          <div className="create-post__action">
            <span className="create-post__icon">😊</span>
            <span className="create-post__text">Cảm xúc/hoạt động</span>
          </div>
        </div>
      </div>

      {showModal && (
        <CreatePostModal
          user={user}
          onClose={handleCloseModal}
          onSubmit={handleSubmitPost}
        />
      )}
    </>
  );
}

export default CreatePost;
