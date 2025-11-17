import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // 간단한 로그인 로직 (실제로는 API 호출 필요)
    if (email && password) {
      // 로그인 성공 시 localStorage에 인증 정보 저장
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminEmail", email);
      navigate("/dashboard");
    } else {
      alert("이메일과 비밀번호를 입력해주세요.");
    }
  };

  return (
    <div id="login" className="login-page">
      <div className="login-container">
          <div className="logo">
            🏠 룸메야!
            <br />
            <small>기숙사 룸메이트 매칭 시스템 - 관리자</small>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>이메일</label>
              <input
                type="email"
                id="admin-email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                id="admin-password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              id="admin-login"
            >
              로그인
            </button>
          </form>

          <a href="#" className="forgot-password">
            비밀번호를 잊으셨나요? | 관리자 등록 문의
          </a>
        </div>
    </div>
  );
}
