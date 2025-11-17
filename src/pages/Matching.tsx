import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/dashboard.css";

interface Survey {
  id: number;
  title: string;
  createdDate: string;
  deadline: string;
  status: "active" | "inactive";
  studentIds: string[];
  students?: SurveyStudent[];
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

interface SurveyResponse {
  studentId: string;
  studentName: string;
  wakeup: string;
  bedtime: string;
  smoking: string;
  sleepHabits: string;
  mbti?: string;
  major?: string;
  specialNotes?: string;
}

export default function Matching() {
  const location = useLocation();
  const [isRunning, setIsRunning] = useState(false);
  const [matchingStatus, setMatchingStatus] = useState<string>("");
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);

  // 설문 목록 가져오기
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

  // 특정 설문의 응답 데이터 가져오기
  const getSurveyResponses = (surveyId: number): SurveyResponse[] => {
    const surveys = getSurveys();
    const survey = surveys.find((s) => s.id === surveyId);
    if (!survey) return [];

    const responses: SurveyResponse[] = [];
    // 설문의 학생 목록에서 응답 찾기
    const studentIds = survey.students
      ? survey.students.map((s) => s.id)
      : survey.studentIds;
    studentIds.forEach((studentId: string) => {
      const response = localStorage.getItem(`survey_${surveyId}_${studentId}`);
      if (response) {
        try {
          responses.push(JSON.parse(response));
        } catch {
          console.error("Failed to parse survey response");
        }
      }
    });
    return responses;
  };

  const handleRunMatching = () => {
    if (!selectedSurveyId) {
      alert("매칭할 설문을 선택해주세요.");
      return;
    }

    const surveys = getSurveys();
    const survey = surveys.find((s) => s.id === selectedSurveyId);
    if (!survey) {
      alert("선택한 설문을 찾을 수 없습니다.");
      return;
    }

    const responses = getSurveyResponses(selectedSurveyId);
    const studentCount = survey.students
      ? survey.students.length
      : survey.studentIds.length;

    if (studentCount < 2) {
      alert(
        "매칭을 실행하려면 최소 2명 이상의 학생이 설문에 포함되어야 합니다."
      );
      return;
    }

    if (responses.length < 2) {
      alert("매칭을 실행하려면 최소 2명 이상의 학생이 설문을 완료해야 합니다.");
      return;
    }

    setIsRunning(true);
    setMatchingStatus("매칭 알고리즘 실행 중...");

    // 매칭 알고리즘 시뮬레이션 (실제로는 서버에서 처리)
    setTimeout(() => {
      // 간단한 매칭 로직 (실제로는 더 복잡한 알고리즘 사용)
      const matchedPairs: Array<{
        studentA: string;
        studentAId: string;
        studentB: string;
        studentBId: string;
        score: number;
      }> = [];
      const used = new Set<string>();

      for (let i = 0; i < responses.length; i++) {
        if (used.has(responses[i].studentId)) continue;

        let bestMatch = null;
        let bestScore = 0;

        for (let j = i + 1; j < responses.length; j++) {
          if (used.has(responses[j].studentId)) continue;

          // 간단한 매칭 점수 계산
          let score = 0;
          if (responses[i].wakeup === responses[j].wakeup) score += 25;
          if (responses[i].bedtime === responses[j].bedtime) score += 25;
          if (responses[i].smoking === responses[j].smoking) score += 20;
          if (responses[i].sleepHabits === responses[j].sleepHabits)
            score += 15;
          if (
            responses[i].mbti &&
            responses[j].mbti &&
            responses[i].mbti === responses[j].mbti
          )
            score += 15;

          if (score > bestScore) {
            bestScore = score;
            bestMatch = responses[j];
          }
        }

        if (bestMatch && bestScore >= 50) {
          matchedPairs.push({
            studentA: responses[i].studentName,
            studentAId: responses[i].studentId,
            studentB: bestMatch.studentName,
            studentBId: bestMatch.studentId,
            score: bestScore,
          });
          used.add(responses[i].studentId);
          used.add(bestMatch.studentId);
        }
      }

      // 매칭 결과를 localStorage에 저장 (설문별로 저장)
      localStorage.setItem(
        `matchingResults_${selectedSurveyId}`,
        JSON.stringify(matchedPairs)
      );
      localStorage.setItem(`matchingExecuted_${selectedSurveyId}`, "true");

      setIsRunning(false);
      setMatchingStatus(
        `매칭 완료! ${matchedPairs.length}개의 쌍이 매칭되었습니다.`
      );

      setTimeout(() => {
        window.location.href = `/results?surveyId=${selectedSurveyId}`;
      }, 2000);
    }, 2000);
  };

  const surveys = getSurveys();
  const activeSurveys = surveys.filter((s) => s.status === "active");

  // 선택된 설문의 통계 계산
  const getSurveyStats = (surveyId: number) => {
    const survey = surveys.find((s) => s.id === surveyId);
    if (!survey) return { total: 0, completed: 0, rate: 0 };

    const responses = getSurveyResponses(surveyId);
    const total = survey.students
      ? survey.students.length
      : survey.studentIds.length;
    const completed = responses.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, rate };
  };

  const stats = selectedSurveyId
    ? getSurveyStats(selectedSurveyId)
    : { total: 0, completed: 0, rate: 0 };

  return (
    <div id="matching" className="dashboard-page">
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
            <div className="page-title">매칭 실행</div>

            <div className="matching-info-section">
              <div className="form-group">
                <label>매칭할 설문 선택</label>
                {activeSurveys.length === 0 ? (
                  <div className="alert alert-info">
                    활성화된 설문이 없습니다. 먼저 설문 관리에서 설문을 생성하고
                    배포해주세요.
                  </div>
                ) : (
                  <select
                    className="form-group input"
                    value={selectedSurveyId || ""}
                    onChange={(e) =>
                      setSelectedSurveyId(Number(e.target.value))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">설문을 선택하세요</option>
                    {activeSurveys.map((survey) => (
                      <option key={survey.id} value={survey.id}>
                        {survey.title} (마감: {survey.deadline})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedSurveyId && (
                <>
                  <div className="info-card">
                    <h3>📊 설문 현황</h3>
                    <div className="info-stats">
                      <div className="stat-item">
                        <span className="stat-label">전체 학생 수</span>
                        <span className="stat-value">{stats.total}명</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">설문 완료</span>
                        <span className="stat-value">{stats.completed}명</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">응답률</span>
                        <span className="stat-value">{stats.rate}%</span>
                      </div>
                    </div>
                  </div>

                  {stats.completed < 2 && (
                    <div className="alert alert-error">
                      매칭을 실행하려면 최소 2명 이상의 학생이 설문을 완료해야
                      합니다.
                    </div>
                  )}

                  {stats.completed >= 2 && (
                    <div className="matching-action-section">
                      <p className="matching-description">
                        선택한 설문의 응답을 기반으로 최적의 룸메이트 매칭을
                        실행합니다.
                        <br />
                        매칭이 완료되면 결과 페이지로 이동합니다.
                      </p>
                      <button
                        className="btn-primary"
                        onClick={handleRunMatching}
                        disabled={isRunning}
                        style={{ fontSize: "18px", padding: "16px 32px" }}
                      >
                        {isRunning ? "매칭 실행 중..." : "⚡ 매칭 실행"}
                      </button>
                      {matchingStatus && (
                        <div
                          className={`alert ${
                            isRunning ? "alert-info" : "alert-success"
                          }`}
                        >
                          {matchingStatus}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
