import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/survey-management.css";

interface Survey {
  id: number;
  title: string;
  createdDate: string;
  deadline: string;
  status: "active" | "inactive";
  studentIds: string[]; // 설문에 참여할 학생 ID 목록
  students: SurveyStudent[]; // 설문별 학생 상세 정보
  questions: Question[];
}

interface SurveyStudent {
  id: string;
  name: string;
  gender: string;
}

interface Question {
  id: number;
  text: string;
  type: "multiple-choice" | "text-input";
}

export default function SurveyManagement() {
  const location = useLocation();

  // localStorage에서 설문 목록 가져오기
  const getSurveys = (): Survey[] => {
    const stored = localStorage.getItem("surveys");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  };

  // 고정된 질문 목록
  const fixedQuestions: Question[] = [
    { id: 1, text: "기상 시간은 언제인가요?", type: "multiple-choice" },
    { id: 2, text: "취침 시간은 언제인가요?", type: "multiple-choice" },
    { id: 3, text: "흡연 여부", type: "multiple-choice" },
    { id: 4, text: "수면 습관 (코골이, 이갈이 등)", type: "multiple-choice" },
    { id: 5, text: "MBTI", type: "text-input" },
    { id: 6, text: "전공", type: "text-input" },
    { id: 7, text: "특이사항 또는 요청사항", type: "text-input" },
  ];

  const [surveys, setSurveys] = useState<Survey[]>(getSurveys());
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyDeadline, setSurveyDeadline] = useState("");
  const [surveyStudents, setSurveyStudents] = useState<SurveyStudent[]>([]);
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGender, setNewStudentGender] = useState("");

  const handleEditSurvey = (surveyId: number) => {
    alert(`설문 ${surveyId} 수정 기능 (구현 예정)`);
  };

  const handleDeleteSurvey = (surveyId: number) => {
    if (confirm(`설문 ${surveyId}를 삭제하시겠습니까?`)) {
      alert("삭제 완료 (구현 예정)");
    }
  };

  const handleAddStudent = () => {
    if (!newStudentId || !newStudentName || !newStudentGender) {
      alert("학번, 이름, 성별을 모두 입력해주세요.");
      return;
    }

    // 중복 확인
    if (surveyStudents.some((s) => s.id === newStudentId)) {
      alert("이미 추가된 학번입니다.");
      return;
    }

    const newStudent: SurveyStudent = {
      id: newStudentId,
      name: newStudentName,
      gender: newStudentGender,
    };

    setSurveyStudents([...surveyStudents, newStudent]);

    // 입력 필드 초기화
    setNewStudentId("");
    setNewStudentName("");
    setNewStudentGender("");
  };

  const handleDeleteStudent = (studentId: string) => {
    if (confirm("이 학생을 목록에서 제거하시겠습니까?")) {
      setSurveyStudents(surveyStudents.filter((s) => s.id !== studentId));
    }
  };

  const handleUploadExcel = () => {
    alert(
      "엑셀 업로드 기능 (구현 예정)\n엑셀 파일 형식: 학번, 이름, 성별, 이메일, 생년월일"
    );
  };

  const handleSaveSurvey = () => {
    if (!surveyTitle || !surveyDeadline) {
      alert("설문 제목과 마감일을 입력해주세요.");
      return;
    }
    if (surveyStudents.length === 0) {
      alert("최소 1명 이상의 학생을 추가해주세요.");
      return;
    }

    const newSurvey: Survey = {
      id: surveys.length > 0 ? Math.max(...surveys.map((s) => s.id)) + 1 : 1,
      title: surveyTitle,
      createdDate: new Date().toISOString().split("T")[0],
      deadline: surveyDeadline,
      status: "inactive",
      studentIds: surveyStudents.map((s) => s.id),
      students: surveyStudents,
      questions: fixedQuestions,
    };

    const updatedSurveys = [...surveys, newSurvey];
    setSurveys(updatedSurveys);
    localStorage.setItem("surveys", JSON.stringify(updatedSurveys));

    // 폼 초기화
    setSurveyTitle("");
    setSurveyDeadline("");
    setSurveyStudents([]);

    alert("설문이 저장되었습니다.");
  };

  const handleDeploySurvey = () => {
    if (!surveyTitle || !surveyDeadline) {
      alert("설문 제목과 마감일을 입력해주세요.");
      return;
    }
    if (surveyStudents.length === 0) {
      alert("최소 1명 이상의 학생을 추가해주세요.");
      return;
    }

    const newSurvey: Survey = {
      id: surveys.length > 0 ? Math.max(...surveys.map((s) => s.id)) + 1 : 1,
      title: surveyTitle,
      createdDate: new Date().toISOString().split("T")[0],
      deadline: surveyDeadline,
      status: "active",
      studentIds: surveyStudents.map((s) => s.id),
      students: surveyStudents,
      questions: fixedQuestions,
    };

    const updatedSurveys = [...surveys, newSurvey];
    setSurveys(updatedSurveys);
    localStorage.setItem("surveys", JSON.stringify(updatedSurveys));

    const surveyLink = `${window.location.origin}/survey/${newSurvey.id}`;
    alert(`설문 배포 완료! 링크: ${surveyLink}`);

    // 폼 초기화
    setSurveyTitle("");
    setSurveyDeadline("");
    setSurveyStudents([]);
  };

  return (
    <div id="survey-management" className="dashboard-page">
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
            <div className="page-title">매칭 설문 관리</div>

            <div className="survey-management-section existing-surveys-table">
              <h3>📋 기존 설문 목록</h3>
              <table className="data-table" id="existing-surveys-table">
                <thead>
                  <tr>
                    <th>설문 제목</th>
                    <th>생성일</th>
                    <th>마감일</th>
                    <th>상태</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  {surveys.map((survey) => (
                    <tr key={survey.id}>
                      <td>{survey.title}</td>
                      <td>{survey.createdDate}</td>
                      <td>{survey.deadline}</td>
                      <td>
                        <span className={`survey-status ${survey.status}`}>
                          {survey.status === "active" ? "활성" : "비활성"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-small btn-edit btn-edit-survey"
                          onClick={() => handleEditSurvey(survey.id)}
                        >
                          수정
                        </button>
                        <button
                          className="btn-small btn-delete btn-delete-survey"
                          onClick={() => handleDeleteSurvey(survey.id)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="survey-management-section">
              <h3>➕ 새 설문 생성</h3>

              <div className="form-group">
                <label>설문 제목</label>
                <input
                  type="text"
                  id="survey-title"
                  placeholder="예: 2025년 봄학기 신입생 매칭 설문"
                  value={surveyTitle}
                  onChange={(e) => setSurveyTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>설문 마감일</label>
                <input
                  type="date"
                  id="survey-deadline"
                  value={surveyDeadline}
                  onChange={(e) => setSurveyDeadline(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>참여 학생 목록 ({surveyStudents.length}명)</label>
                <div className="survey-student-management">
                  <div className="student-add-section">
                    <div className="action-buttons">
                      <button
                        className="btn-success"
                        onClick={handleUploadExcel}
                      >
                        📁 엑셀 파일 업로드
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={handleAddStudent}
                      >
                        ➕ 개별 학생 추가
                      </button>
                    </div>

                    <div className="student-add-form">
                      <div className="form-row">
                        <div className="form-group-small">
                          <label>학번 *</label>
                          <input
                            type="text"
                            placeholder="학번"
                            value={newStudentId}
                            onChange={(e) => setNewStudentId(e.target.value)}
                          />
                        </div>
                        <div className="form-group-small">
                          <label>이름 *</label>
                          <input
                            type="text"
                            placeholder="이름"
                            value={newStudentName}
                            onChange={(e) => setNewStudentName(e.target.value)}
                          />
                        </div>
                        <div className="form-group-small">
                          <label>성별 *</label>
                          <select
                            value={newStudentGender}
                            onChange={(e) =>
                              setNewStudentGender(e.target.value)
                            }
                          >
                            <option value="">선택</option>
                            <option value="남">남</option>
                            <option value="여">여</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {surveyStudents.length > 0 && (
                    <div className="student-list-table">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>학번</th>
                            <th>이름</th>
                            <th>성별</th>
                            <th>작업</th>
                          </tr>
                        </thead>
                        <tbody>
                          {surveyStudents.map((student) => (
                            <tr key={student.id}>
                              <td>{student.id}</td>
                              <td>{student.name}</td>
                              <td>{student.gender}</td>
                              <td>
                                <button
                                  className="btn-small btn-delete"
                                  onClick={() =>
                                    handleDeleteStudent(student.id)
                                  }
                                >
                                  삭제
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div className="question-list">
                <h4>📋 설문 질문 목록 (고정)</h4>
                <div id="question-preview">
                  {fixedQuestions.map((question, index) => (
                    <div className="question-item" key={question.id}>
                      <span className="question-text">
                        {index + 1}. {question.text}
                        <span
                          className={`question-type-badge ${question.type}`}
                        >
                          {question.type === "multiple-choice"
                            ? "객관식"
                            : "주관식"}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="survey-form-actions">
                <button
                  className="btn-secondary"
                  id="save-survey"
                  onClick={handleSaveSurvey}
                >
                  💾 저장
                </button>
                <button
                  className="btn-primary"
                  id="deploy-survey"
                  onClick={handleDeploySurvey}
                >
                  🚀 설문 배포 (링크 생성)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
