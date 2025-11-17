import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/dashboard.css";

interface Student {
  id: string;
  name: string;
  gender: string;
  email: string;
  birthDate: string;
  registerDate: string;
}

export default function Dashboard() {
  const location = useLocation();

  // localStorage에서 학생 데이터 가져오기 또는 기본 데이터 사용
  const getInitialStudents = (): Student[] => {
    const stored = localStorage.getItem("students");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse student data", e);
      }
    }
    // 기본 학생 데이터
    const defaultStudents: Student[] = [
      {
        id: "2024001",
        name: "김철수",
        gender: "남",
        email: "kim@university.ac.kr",
        birthDate: "2005-03-15",
        registerDate: "2024-10-01",
      },
      {
        id: "2024002",
        name: "이영희",
        gender: "여",
        email: "lee@university.ac.kr",
        birthDate: "2005-07-22",
        registerDate: "2024-10-01",
      },
    ];
    localStorage.setItem("students", JSON.stringify(defaultStudents));
    return defaultStudents;
  };

  const [students, setStudents] = useState<Student[]>(getInitialStudents);

  // 학생 데이터가 변경될 때마다 localStorage에 저장
  const updateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem("students", JSON.stringify(newStudents));
  };

  const handleEdit = (studentId: string) => {
    alert(`학생 ${studentId} 수정 기능 (구현 예정)`);
  };

  const handleDelete = (studentId: string) => {
    if (confirm(`학생 ${studentId}를 삭제하시겠습니까?`)) {
      const updatedStudents = students.filter((s) => s.id !== studentId);
      updateStudents(updatedStudents);
      alert("삭제 완료");
    }
  };

  const handleUploadExcel = () => {
    alert("엑셀 업로드 기능 (구현 예정)");
  };

  const handleAddStudent = () => {
    alert("학생 추가 기능 (구현 예정)");
  };

  return (
    <div id="dashboard" className="dashboard-page">
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
            <div className="page-title">학생 목록 관리</div>

            <div className="action-buttons">
              <button
                className="btn-success"
                id="upload-excel"
                onClick={handleUploadExcel}
              >
                📁 엑셀 파일 업로드
              </button>
              <button
                className="btn-secondary"
                id="add-student"
                onClick={handleAddStudent}
              >
                ➕ 개별 학생 추가
              </button>
            </div>

            <table className="data-table" id="student-table">
              <thead>
                <tr>
                  <th>학번</th>
                  <th>이름</th>
                  <th>성별</th>
                  <th>이메일</th>
                  <th>생년월일</th>
                  <th>등록일</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.gender}</td>
                    <td>{student.email}</td>
                    <td>{student.birthDate}</td>
                    <td>{student.registerDate}</td>
                    <td>
                      <button
                        className="btn-small btn-edit"
                        onClick={() => handleEdit(student.id)}
                      >
                        수정
                      </button>
                      <button
                        className="btn-small btn-delete"
                        onClick={() => handleDelete(student.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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
              <button className="pagination-btn" data-page="3">
                3
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
