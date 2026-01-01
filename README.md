# ⚡ 전기기사 합격 치트키 앱 (Electrician Pass)

전기기사 자격증 필기시험을 대비하는 **AI 기반 학습 웹 애플리케이션**입니다.  
핵심 기능은 **문제 풀이 + 형광펜 효과 치트키 연동 + 오답노트**입니다.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![Python](https://img.shields.io/badge/Python-3.8+-yellow?style=for-the-badge&logo=python)

---

## 🎯 주요 기능

### ✨ 핵심 기능
1. **📚 과목별 필터링**: 회로이론, 전기자기학, 전기기기, 전력공학 4개 과목 선택
2. **🎯 문제 유형 선택**: 암기형, 공식형 문제 분류
3. **⚡ 실시간 채점**: 답변 즉시 정답/오답 확인
4. **💡 형광펜 치트키**: 틀린 문제마다 PDF 자료의 핵심 요약을 **노란색 형광펜 효과**로 강조 표시
5. **📝 오답노트**: 틀린 문제와 치트키만 모아서 복습
6. **📊 결과 분석**: 점수, 정답률, 학습 팁 제공
7. **🤖 자동 데이터 추출**: Python으로 PDF에서 문제 자동 추출

### 🎨 디자인 특징
- **Glassmorphism**: 고급스러운 유리 효과 UI
- **형광펜 효과**: 치트키 박스에 노란색 하이라이트 + 펄스 애니메이션
- **그라데이션 효과**: 전기(Electric) 테마의 다채로운 색상
- **마이크로 애니메이션**: 부드러운 인터랙션
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **다크 모드**: 눈의 피로를 줄이는 다크 테마

---

## 🚀 빠른 시작

### 1️⃣ 프로젝트 클론
\`\`\`bash
git clone <your-repo-url>
cd qualifications
\`\`\`

### 2️⃣ 의존성 설치
\`\`\`bash
npm install
\`\`\`

### 3️⃣ 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

**✅ 현재 Mock 데이터 10개 문제로 즉시 테스트 가능합니다!**

---

## 📦 프로젝트 구조

\`\`\`
qualifications/
├── src/
│   ├── app/
│   │   ├── globals.css          # 프리미엄 디자인 시스템 (형광펜 효과 포함)
│   │   ├── layout.tsx            # Root Layout & SEO
│   │   └── page.tsx              # 메인 퀴즈 시스템 (오답노트 통합)
│   ├── components/
│   │   ├── QuizCard.tsx          # 문제 카드 & 치트키 표시
│   │   ├── ResultCard.tsx        # 결과 화면 & 통계
│   │   ├── FilterBar.tsx         # 과목/유형 필터
│   │   └── WrongAnswersNote.tsx  # 오답노트 컴포넌트
│   ├── lib/
│   │   └── supabase.ts           # Supabase 클라이언트
│   └── types/
│       └── index.ts              # TypeScript 타입
├── scripts/
│   ├── extract_pdf_data.py       # 🤖 PDF 자동 추출 스크립트
│   ├── requirements.txt          # Python 의존성
│   └── README.md                 # PDF 추출 가이드
├── supabase/
│   ├── schema_v2.sql             # 업그레이드된 DB 스키마
│   └── seed.sql                  # 초기 시드 데이터
├── [린치핀에듀]전기기사 필기 치트키(F)_rev0.PDF
├── [따다] 전기기사 전과목 공식 모음집.pdf
├── 전기기사+필기.pdf
└── README.md
\`\`\`

---

## 🗄️ 데이터베이스 스키마

### `questions` 테이블
| 컬럼명          | 타입      | 설명                          |
|-----------------|-----------|-------------------------------|
| id              | UUID      | 기본키 (자동 생성)             |
| category        | TEXT      | 과목명                        |
| type            | TEXT      | 문제 유형 (암기/공식)          |
| question_text   | TEXT      | 문제 지문                      |
| options         | JSONB     | 보기 4개 (JSON 배열)           |
| correct_answer  | TEXT      | 정답                          |
| explanation     | TEXT      | 상세 해설                      |
| cheat_key       | TEXT      | 💡 핵심 치트키 (공식/요약)     |
| difficulty      | TEXT      | 난이도 (상/중/하)             |
| source_file     | TEXT      | 원본 PDF 파일명               |
| page_number     | INTEGER   | PDF 페이지 번호                |

### `user_progress` 테이블 (향후 확장)
사용자별 학습 진행률 및 오답 기록

---

## 🤖 PDF 데이터 자동 추출

### 실행 방법
\`\`\`bash
# 1. Python 의존성 설치
cd scripts
pip install -r requirements.txt

# 2. PDF 추출 스크립트 실행
python extract_pdf_data.py

# 3. 결과 확인
# questions_seed.json 파일 생성됨
\`\`\`

### 추출 기능
- ✅ 정규식 패턴 매칭으로 문제 자동 인식
- ✅ 보기 추출 (`①②③④`, `가나다라`, `1)2)3)4)`)
- ✅ 정답 추출 (`정답: 1`, `정답 ①`)
- ✅ 치트키 추출 (`💡`, `Cheatkey`, `공식`, `꿀팁`)
- ✅ 과목 자동 분류 (키워드 기반)
- ✅ 문제 유형 추론 (공식 포함 여부)
- ✅ 난이도 자동 추정 (문제 길이 기반)

### 추출 예시
```json
{
  "category": "회로이론",
  "type": "공식",
  "question_text": "저항 R에 전압 V를 가했을 때 흐르는 전류 I를 구하는 공식은?",
  "options": ["I = V/R", "I = R/V", "I = V*R", "I = V^2/R"],
  "correct_answer": "I = V/R",
  "explanation": "전류는 전압에 비례하고 저항에 반비례합니다.",
  "cheat_key": "💡 [치트키 01] 옴의 법칙: V=IR, I=V/R, R=V/I",
  "difficulty": "중",
  "source_file": "[린치핀에듀]전기기사 필기 치트키(F)_rev0.PDF",
  "page_number": 1
}
```

**자세한 가이드**: `scripts/README.md` 참조

---

## 🔧 Supabase 설정 (선택사항)

현재는 Mock 데이터로 작동하지만, 실제 DB를 사용하려면:

### 1. Supabase 프로젝트 생성
[Supabase](https://supabase.com)에서 무료 프로젝트 생성

### 2. 환경 변수 설정
\`\`\`bash
# .env.local 파일 생성
cp env.example .env.local

# .env.local 파일 수정
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### 3. 스키마 생성
Supabase SQL Editor에서 `supabase/schema_v2.sql` 실행

### 4. 데이터 삽입
\`\`\`bash
# Python으로 JSON을 SQL로 변환 후 삽입
# 또는 Supabase Dashboard에서 수동 import
\`\`\`

### 5. Next.js 연결
\`\`\`typescript
// src/app/page.tsx 61번째 줄 주석 해제
loadQuestions(); // Supabase에서 데이터 로드
\`\`\`

---

## 💡 핵심 기능 상세 설명

### 1️⃣ 형광펜 치트키
```css
/* globals.css */
.cheat-key-box {
  background: linear-gradient(135deg, 
    rgba(253, 224, 71, 0.25) 0%,   /* 진한 노란색 */
    rgba(250, 204, 21, 0.2) 50%,   /* 황금색 */
    rgba(245, 158, 11, 0.15) 100%  /* 오렌지색 */
  );
  animation: highlightPulse 2s ease-in-out infinite;
}
```

- 📌 노란색 형광펜 배경
- 📌 펄스 애니메이션 (2초 주기)
- 📌 형광펜 스윕 효과

### 2️⃣ 오답노트
- ✅ 틀린 문제만 필터링하여 표시
- ✅ 내 답안 vs 정답 비교
- ✅ 각 문제의 치트키 강조
- ✅ 학습 팁 제공

### 3️⃣ 결과 화면
- ✅ 60점 이상 합격 / 미만 불합격 메시지
- ✅ 원형 진행률 차트 (SVG)
- ✅ 오답노트 바로가기 버튼
- ✅ 학습 통계 (총 문제, 정답, 오답)

---

## 🎨 디자인 시스템

### 색상 팔레트 (Electric Theme)
- **Electric Blue**: `#0ea5e9` - 주요 액센트
- **Electric Violet**: `#8b5cf6` - 보조 액센트
- **Electric Amber**: `#f59e0b` - 경고/강조
- **Electric Emerald**: `#10b981` - 성공/정답
- **Electric Rose**: `#f43f5e` - 오답/에러
- **Highlight Yellow**: `#fde047` - 형광펜 효과

### 타이포그래피
- **한글**: Noto Sans KR (300-900)
- **영문/숫자**: Inter (300-900)

---

## 📈 향후 개선 사항

- [ ] 사용자 인증 시스템 (Supabase Auth)
- [ ] 학습 진행률 저장 (user_progress 테이블)
- [ ] 문제 추가/수정 관리자 페이지
- [ ] PDF OCR 지원 (스캔 이미지용)
- [ ] 타이머 모드 (실제 시험 시뮬레이션)
- [ ] 통계 대시보드 (과목별 정답률 차트)
- [ ] 모바일 앱 (PWA)
- [ ] 음성 해설 (TTS)

---

## 🛠️ 기술 스택

### Frontend
- **Next.js 15**: React 프레임워크 (App Router)
- **TypeScript**: 타입 안정성
- **TailwindCSS**: 유틸리티 우선 CSS
- **React Hooks**: 상태 관리

### Backend & Data
- **Supabase**: PostgreSQL 데이터베이스 (선택사항)
- **Python 3.8+**: PDF 데이터 추출
- **pdfplumber**: PDF 텍스트 추출 라이브러리

### Dev Tools
- **ESLint**: 코드 품질 관리
- **PostCSS**: CSS 전처리

---

## 📝 라이선스

MIT License

---

## 👨‍💻 개발자 노트

### 중요 파일
- `src/app/globals.css` - 형광펜 효과 (`.cheat-key-box`)
- `src/components/WrongAnswersNote.tsx` - 오답노트 로직
- `scripts/extract_pdf_data.py` - PDF 추출 알고리즘

### 팁
1. **PDF 추출 문제**: 스캔 이미지 PDF는 OCR 필요
2. **Supabase 연결**: Mock 데이터로도 충분히 테스트 가능
3. **디자인 수정**: `globals.css`에서 색상 변경 가능

---

**⚡ 전기기사 시험 합격을 응원합니다! ⚡**

📧 이슈 및 기여: [GitHub Issues](#)
