import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/survey.css";

interface Survey {
  id: number;
  title: string;
  students?: SurveyStudent[];
  studentIds: string[];
}

interface SurveyStudent {
  id: string;
  name: string;
  gender: string;
}

// 설문별 학생 데이터 가져오기 함수
const getSurveyStudentData = (surveyId: number) => {
  const stored = localStorage.getItem("surveys");
  if (stored) {
    try {
      const surveys: Survey[] = JSON.parse(stored);
      const survey = surveys.find((s) => s.id === surveyId);
      if (survey && survey.students) {
        return survey.students.map((s) => ({ id: s.id, name: s.name }));
      }
      if (survey && survey.studentIds) {
        // studentIds만 있는 경우 (하위 호환성)
        return survey.studentIds.map((id) => ({ id, name: "" }));
      }
    } catch (e) {
      console.error("Failed to parse survey data", e);
    }
  }
  return [];
};

export default function Survey() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const surveyIdNum = surveyId ? parseInt(surveyId, 10) : null;
  
  const [isVerified, setIsVerified] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    wakeup: "",
    bedtime: "",
    smoking: "",
    sleepHabits: "",
    mbti: "",
    major: "",
    specialNotes: "",
  });

  // 이미 제출했는지 확인
  useEffect(() => {
    if (studentId && surveyIdNum) {
      const submitted = localStorage.getItem(`survey_submitted_${surveyIdNum}_${studentId}`);
      if (submitted === "true") {
        setIsSubmitted(true);
      }
    }
  }, [studentId, surveyIdNum]);

  const handleVerify = () => {
    setVerificationError("");
    if (!studentId || !studentName) {
      setVerificationError("학번과 이름을 모두 입력해주세요.");
      return;
    }

    if (!surveyIdNum) {
      setVerificationError("설문 ID가 없습니다.");
      return;
    }

    // 설문별 학생 정보 확인
    const studentData = getSurveyStudentData(surveyIdNum);
    const student = studentData.find(
      (s) => s.id === studentId && s.name === studentName
    );

    if (student) {
      setIsVerified(true);
      setVerificationError("");
      // 이미 제출했는지 확인
      const submitted = localStorage.getItem(`survey_submitted_${surveyIdNum}_${studentId}`);
      if (submitted === "true") {
        setIsSubmitted(true);
      }
    } else {
      setVerificationError("학번과 이름이 일치하지 않습니다. 다시 확인해주세요.");
      setIsVerified(false);
    }
  };

  const handleSubmit = () => {
    if (!isVerified) {
      alert("먼저 신원 확인을 완료해주세요.");
      return;
    }

    if (isSubmitted) {
      alert("이미 제출한 설문입니다. 한 번 제출한 설문은 수정할 수 없습니다.");
      return;
    }

    // 필수 항목 확인
    if (
      !formData.wakeup ||
      !formData.bedtime ||
      !formData.smoking ||
      !formData.sleepHabits
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (!surveyIdNum) {
      alert("설문 ID가 없습니다.");
      return;
    }

    // 제출 데이터 저장 (설문별로 저장)
    const submissionData = {
      studentId,
      studentName,
      ...formData,
      submittedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(`survey_${surveyIdNum}_${studentId}`, JSON.stringify(submissionData));
    localStorage.setItem(`survey_submitted_${surveyIdNum}_${studentId}`, "true");
    
    setIsSubmitted(true);
    alert("설문조사가 제출되었습니다!");
  };

  const handleRadioChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div id="survey" className="survey-page">
      <div className="survey-content">
        <div className="survey-intro">
          <div className="page-title">룸메이트 매칭을 위한 기본 설문조사</div>
          <p>최적의 룸메이트 매칭을 위해 솔직하게 답변해 주세요.</p>
        </div>

        <div className="survey-section">
          <h3>🔍 신원 확인</h3>
          {isSubmitted && (
            <div className="alert alert-info">
              이미 제출한 설문입니다. 한 번 제출한 설문은 수정할 수 없습니다.
            </div>
          )}
          <div className="form-group">
            <label>학번</label>
            <input
              type="text"
              id="student-id"
              placeholder="학번을 입력하세요"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                setIsVerified(false);
                setIsSubmitted(false);
              }}
              disabled={isSubmitted}
            />
          </div>
          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              id="student-name"
              placeholder="이름을 입력하세요"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                setIsVerified(false);
                setIsSubmitted(false);
              }}
              disabled={isSubmitted}
            />
          </div>
          {verificationError && (
            <div className="alert alert-error">{verificationError}</div>
          )}
          {isVerified && !isSubmitted && (
            <div className="alert alert-success">신원 확인이 완료되었습니다.</div>
          )}
          <button
            className="btn-primary"
            id="verify-identity"
            onClick={handleVerify}
            disabled={isSubmitted}
          >
            확인
          </button>
        </div>

        <div
          id="survey-questions"
          className={`survey-section ${!isVerified ? "disabled" : ""}`}
        >
          <h3>📋 설문 항목</h3>

          <div className="form-group">
            <label>기상 시간</label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  name="wakeup"
                  value="before6"
                  checked={formData.wakeup === "before6"}
                  onChange={(e) => handleRadioChange("wakeup", e.target.value)}
                />
                오전 6시 이전
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  name="wakeup"
                  value="6to8"
                  checked={formData.wakeup === "6to8"}
                  onChange={(e) => handleRadioChange("wakeup", e.target.value)}
                />
                오전 6시 - 8시
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  name="wakeup"
                  value="8to10"
                  checked={formData.wakeup === "8to10"}
                  onChange={(e) => handleRadioChange("wakeup", e.target.value)}
                />
                오전 8시 - 10시
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  name="wakeup"
                  value="after10"
                  checked={formData.wakeup === "after10"}
                  onChange={(e) => handleRadioChange("wakeup", e.target.value)}
                />
                오전 10시 이후
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>취침 시간</label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  name="bedtime"
                  value="before10"
                  checked={formData.bedtime === "before10"}
                  onChange={(e) => handleRadioChange("bedtime", e.target.value)}
                />
                오후 10시 이전
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  name="bedtime"
                  value="10to12"
                  checked={formData.bedtime === "10to12"}
                  onChange={(e) => handleRadioChange("bedtime", e.target.value)}
                />
                오후 10시 - 12시
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  name="bedtime"
                  value="12to2"
                  checked={formData.bedtime === "12to2"}
                  onChange={(e) => handleRadioChange("bedtime", e.target.value)}
                />
                오전 12시 - 2시
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  name="bedtime"
                  value="after2"
                  checked={formData.bedtime === "after2"}
                  onChange={(e) => handleRadioChange("bedtime", e.target.value)}
                />
                오전 2시 이후
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>흡연 여부</label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  name="smoking"
                  value="yes"
                  checked={formData.smoking === "yes"}
                  onChange={(e) => handleRadioChange("smoking", e.target.value)}
                />
                예
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  name="smoking"
                  value="no"
                  checked={formData.smoking === "no"}
                  onChange={(e) => handleRadioChange("smoking", e.target.value)}
                />
                아니오
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>수면 습관 (코골이, 이갈이 등)</label>
            <div className="radio-group">
              <div className="radio-item">
                <input
                  type="radio"
                  name="sleep_habits"
                  value="yes"
                  checked={formData.sleepHabits === "yes"}
                  onChange={(e) =>
                    handleRadioChange("sleepHabits", e.target.value)
                  }
                />
                있음
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  name="sleep_habits"
                  value="no"
                  checked={formData.sleepHabits === "no"}
                  onChange={(e) =>
                    handleRadioChange("sleepHabits", e.target.value)
                  }
                />
                없음
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>MBTI</label>
            <input
              type="text"
              id="mbti"
              placeholder="MBTI를 입력하세요 (예: ENFP)"
              value={formData.mbti}
              onChange={(e) =>
                setFormData({ ...formData, mbti: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>전공</label>
            <input
              type="text"
              id="major"
              placeholder="전공을 입력하세요"
              value={formData.major}
              onChange={(e) =>
                setFormData({ ...formData, major: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>특이사항 또는 요청사항</label>
            <textarea
              rows={4}
              id="special-notes"
              placeholder="추가로 알려주고 싶은 내용이 있다면 작성해 주세요"
              value={formData.specialNotes}
              onChange={(e) =>
                setFormData({ ...formData, specialNotes: e.target.value })
              }
            />
          </div>

          <div className="survey-submit">
            <button
              className="btn-primary"
              id="submit-survey"
              onClick={handleSubmit}
            >
              제출하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
