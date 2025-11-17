import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/results.css";

interface MatchResult {
  id: number;
  roomNumber: string;
  studentA: string;
  studentB: string;
  matchScore: number;
}

export default function Results() {
  const location = useLocation();

  const [results] = useState<MatchResult[]>([
    {
      id: 1,
      roomNumber: "A101",
      studentA: "2024001 김철수",
      studentB: "2024003 박민수",
      matchScore: 95,
    },
    {
      id: 2,
      roomNumber: "A102",
      studentA: "2024005 정우진",
      studentB: "2024007 최동혁",
      matchScore: 88,
    },
  ]);

  const handleEditMatch = (matchId: number) => {
    alert(`매칭 ${matchId} 수정 기능 (구현 예정)`);
  };

  const handleDownloadResults = () => {
    alert("엑셀 다운로드 기능 (구현 예정)");
  };

  const handleFinalizeResults = () => {
    if (confirm("매칭 결과를 확정하고 이메일을 발송하시겠습니까?")) {
      alert("이메일 발송 완료 (구현 예정)");
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 90) return "high";
    if (score >= 80) return "medium";
    return "low";
  };

  return (
    <div id="results" className="dashboard-page">
      <div className="dashboard-content">
        <div className="dashboard">
          <div className="sidebar">
            <div className="sidebar-header">
              <div className="sidebar-header-title">메뉴</div>
              <div className="sidebar-admin-info">
                <div className="admin-name">
                  관리자: {localStorage.getItem("adminEmail") || "홍길동님"}
                </div>
                <button
                  className="sidebar-logout-btn"
                  onClick={() => {
                    localStorage.removeItem("isAdmin");
                    localStorage.removeItem("adminEmail");
                    window.location.href = "/login";
                  }}
                >
                  로그아웃
                </button>
              </div>
            </div>
            <ul className="sidebar-menu">
              <li>
                <Link
                  to="/dashboard"
                  className={location.pathname === "/dashboard" ? "active" : ""}
                >
                  📋 학생 목록 관리
                </Link>
              </li>
              <li>
                <Link
                  to="/survey-management"
                  className={
                    location.pathname === "/survey-management" ? "active" : ""
                  }
                >
                  📝 매칭 설문 관리
                </Link>
              </li>
              <li>
                <Link
                  to="/matching"
                  className={location.pathname === "/matching" ? "active" : ""}
                >
                  ⚡ 매칭 실행
                </Link>
              </li>
              <li>
                <Link
                  to="/results"
                  className={location.pathname === "/results" ? "active" : ""}
                >
                  📊 매칭 결과 보기
                </Link>
              </li>
            </ul>
          </div>

          <div className="main-content">
            <div className="page-title">매칭 결과 검토</div>

            <div className="summary-cards">
              <div className="summary-card">
                <h3 id="total-matched">156</h3>
                <p>총 매칭된 학생</p>
              </div>
              <div className="summary-card">
                <h3 id="successful-pairs">78</h3>
                <p>매칭 성공 쌍</p>
              </div>
              <div className="summary-card">
                <h3 id="success-rate">92%</h3>
                <p>매칭 성공률</p>
              </div>
              <div className="summary-card">
                <h3 id="unmatched">12</h3>
                <p>미매칭 학생</p>
              </div>
            </div>

            <div className="results-actions">
              <button
                className="btn-success"
                id="download-results"
                onClick={handleDownloadResults}
              >
                📊 엑셀로 결과 다운로드
              </button>
              <button
                className="btn-primary"
                id="finalize-results"
                onClick={handleFinalizeResults}
              >
                ✉️ 확정 및 이메일 알림 발송
              </button>
            </div>

            <div className="results-table-container">
              <table className="data-table" id="results-table">
                <thead>
                  <tr>
                    <th>방 번호</th>
                    <th>학생 A 정보</th>
                    <th>학생 B 정보</th>
                    <th>매칭 점수</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id}>
                      <td>{result.roomNumber}</td>
                      <td>{result.studentA}</td>
                      <td>{result.studentB}</td>
                      <td>
                        <span
                          className={`match-score ${getScoreClass(
                            result.matchScore
                          )}`}
                        >
                          {result.matchScore}점
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-small btn-edit btn-edit-match"
                          onClick={() => handleEditMatch(result.id)}
                        >
                          수정
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button className="pagination-btn" data-page="prev">
                이전
              </button>
              <button className="pagination-btn active" data-page="1">
                1
              </button>
              <button className="pagination-btn" data-page="2">
                2
              </button>
              <button className="pagination-btn" data-page="next">
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
