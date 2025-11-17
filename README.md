# 룸메야! (Roomeya) - 기숙사 룸메이트 매칭 시스템 프론트엔드

기숙사 학생들의 최적의 룸메이트 매칭을 위한 관리자 대시보드 및 학생 설문조사 시스템입니다.

## 🚀 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구 및 개발 서버
- **React Router v7** - 클라이언트 사이드 라우팅
- **CSS Modules** - 스타일링

## 📋 주요 기능

### 1. 관리자 로그인

- 관리자 인증 및 로그인 기능

### 2. 관리자 대시보드

- 학생 목록 관리 (추가, 수정, 삭제)
- 엑셀 파일 업로드를 통한 대량 학생 등록
- 페이지네이션

### 3. 학생 설문조사

- 학생 신원 확인
- 생활 습관 설문 (기상/취침 시간, 흡연 여부, 수면 습관)
- MBTI, 전공, 특이사항 입력

### 4. 매칭 결과 보기

- 매칭 성공률 및 통계 대시보드
- 룸메이트 매칭 결과 조회
- 매칭 점수별 시각화
- 엑셀 다운로드 및 이메일 발송 기능

### 5. 설문 관리

- 커스텀 설문 생성 및 관리
- 객관식/주관식 질문 추가
- 설문 배포 및 링크 생성

## 🛠️ 설치 및 실행

### 필수 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
# 프로젝트 디렉토리로 이동
cd rommate-fe

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 시작되면 브라우저에서 `http://localhost:5173`으로 접속하세요.

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 빌드 미리보기

```bash
npm run preview
```

## 📁 프로젝트 구조

```
rommate-fe/
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   └── Navigation.tsx  # 네비게이션 바
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── Login.tsx       # 로그인 페이지
│   │   ├── Dashboard.tsx   # 대시보드 페이지
│   │   ├── Survey.tsx      # 설문조사 페이지
│   │   ├── Results.tsx     # 매칭 결과 페이지
│   │   └── SurveyManagement.tsx  # 설문 관리 페이지
│   ├── styles/             # CSS 파일
│   │   ├── common.css      # 공통 스타일
│   │   ├── navigation.css  # 네비게이션 스타일
│   │   ├── login.css       # 로그인 스타일
│   │   ├── dashboard.css   # 대시보드 스타일
│   │   ├── survey.css      # 설문조사 스타일
│   │   ├── results.css     # 결과 스타일
│   │   └── survey-management.css  # 설문 관리 스타일
│   ├── App.tsx             # 메인 앱 컴포넌트
│   ├── App.css             # 앱 스타일
│   ├── main.tsx            # 앱 진입점
│   └── index.css           # 전역 스타일
├── public/                 # 정적 파일
├── index.html              # HTML 템플릿
├── package.json            # 프로젝트 설정
├── tsconfig.json           # TypeScript 설정
├── vite.config.ts          # Vite 설정
└── README.md               # 프로젝트 문서
```

## 🎨 라우팅 구조

| 경로                 | 페이지             | 설명                              |
| -------------------- | ------------------ | --------------------------------- |
| `/`                  | Login (리다이렉트) | 기본 경로는 로그인으로 리다이렉트 |
| `/login`             | Login              | 관리자 로그인 페이지              |
| `/dashboard`         | Dashboard          | 학생 목록 관리 대시보드           |
| `/survey`            | Survey             | 학생용 설문조사 페이지            |
| `/results`           | Results            | 매칭 결과 조회 페이지             |
| `/survey-management` | SurveyManagement   | 설문 생성 및 관리 페이지          |

## 🔧 개발 가이드

### 새로운 페이지 추가하기

1. `src/pages/` 에 새 페이지 컴포넌트 생성
2. `src/App.tsx` 에 라우트 추가
3. 필요한 경우 `src/components/Navigation.tsx` 에 네비게이션 항목 추가

### 스타일 수정하기

- 공통 스타일: `src/styles/common.css`
- 페이지별 스타일: `src/styles/[page-name].css`

## 🌐 향후 백엔드 연동

현재는 프론트엔드 프로토타입으로, 실제 데이터는 하드코딩되어 있습니다.
향후 백엔드 API 연동 시 다음 작업이 필요합니다:

1. API 클라이언트 설정 (axios 또는 fetch)
2. 환경 변수 설정 (`.env` 파일)
3. 인증 토큰 관리 (localStorage 또는 Context API)
4. API 엔드포인트 연결
   - `POST /api/auth/login` - 로그인
   - `GET /api/students` - 학생 목록 조회
   - `POST /api/students` - 학생 추가
   - `GET /api/surveys` - 설문 목록
   - `POST /api/surveys/responses` - 설문 응답 제출
   - `GET /api/matching/results` - 매칭 결과 조회

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 👥 기여

버그 리포트 및 기능 제안은 이슈를 통해 제출해주세요.

---

Made with ❤️ for better roommate matching
