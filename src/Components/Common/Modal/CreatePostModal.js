import React, { useState } from "react";
import "./CreatePostModal.css";
import Modal from "../../Common/Modal/Modal";
function CreatePostModal({ user, onClose, onSubmit }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // API upload ảnh
  const uploadPhoto = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user.id) {
      setError("Vui lòng đăng nhập để đăng bài!");
      return;
    }

    if (!selectedImage) {
      setError("Vui lòng chọn ảnh để đăng!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("photo", selectedImage);
      formData.append("user_id", user.id);

      const response = await fetch("http://localhost:8081/api/photo/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Không thể đăng bài viết");
      }

      const data = await response.json();
      console.log("Upload thành công:", data);

      // Gọi callback để reload lại danh sách bài viết từ API
      if (onSubmit) {
        onSubmit(); // Không truyền object, chỉ signal để reload
      }

      // Đóng modal
      onClose();
    } catch (error) {
      console.error("Error uploading photo:", error);
      setError("Không thể đăng bài viết. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadPhoto();
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <Modal onClose={onClose}>
      <div className="create-post-modal">
        <div className="create-post-modal__header">
          <h2 className="create-post-modal__title">Đăng ảnh</h2>
        </div>

        <div className="create-post-modal__user">
          <img
            src={user.avatar}
            alt={user.firstname}
            className="create-post-modal__avatar"
          />
          <span className="create-post-modal__name">
            {user.firstname} {user.lastname}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="create-post-modal__form">
          {error && <div className="create-post-modal__error">{error}</div>}

          {imagePreview && (
            <div className="create-post-modal__image-preview">
              <button
                type="button"
                className="create-post-modal__remove-image"
                onClick={removeImage}
                disabled={loading}
              >
                ✕
              </button>
              <img
                src={imagePreview}
                alt="Preview"
                className="create-post-modal__preview-img"
              />
            </div>
          )}

          {!selectedImage && (
            <div className="create-post-modal__image-upload">
              <label className="create-post-modal__upload-label">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="create-post-modal__upload-input"
                  disabled={loading}
                  required
                />
                <div className="create-post-modal__upload-area">
                  <span className="create-post-modal__upload-icon">📷</span>
                  <span className="create-post-modal__upload-text">
                    Chọn ảnh để đăng
                  </span>
                  <span className="create-post-modal__upload-subtext">
                    hoặc kéo và thả
                  </span>
                </div>
              </label>
            </div>
          )}

          <button
            type="submit"
            className="create-post-modal__submit"
            disabled={loading || !selectedImage}
          >
            {loading ? "Đang đăng..." : "Đăng ảnh"}
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default CreatePostModal;
