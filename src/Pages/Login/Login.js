import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login({ onLogin }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.token !== null) {
        // Đăng nhập thành công
        // Lưu token vào localStorage
        localStorage.setItem("token", data.token);

        // Tạo user object từ response (có thể cần điều chỉnh theo API của bạn)
        const userData = {
          id: data._id, // Có thể lấy từ token hoặc API khác
          firstname: data.first_name, // Tạm thời dùng userName
          lastname: data.last_name,
          userName: userName,
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        };

        // Lưu user vào localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // Gọi callback để cập nhật state ở component cha
        if (onLogin) {
          onLogin(userData);
        }

        // Chuyển về trang chủ
        navigate("/");
      } else {
        // Đăng nhập thất bại
        setError(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Lỗi kết nối đến server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__header">
          <h1 className="login__title">Đăng nhập</h1>
          <p className="login__subtitle">Chào mừng bạn quay trở lại!</p>
        </div>

        <form onSubmit={handleSubmit} className="login__form">
          {error && <div className="login__error">{error}</div>}

          <div className="login__field">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Tên đăng nhập"
              className="login__input"
              required
              disabled={loading}
            />
          </div>

          <div className="login__field">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="login__input"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login__submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="login__footer">
          <p className="login__register-text">
            Chưa có tài khoản?
            <Link to="/register" className="login__register-link">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* <div className="login__demo">
          <p className="login__demo-text">
            <strong>Tài khoản demo:</strong>
            <br />
            Username: a1
            <br />
            Mật khẩu: 1
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default Login;
