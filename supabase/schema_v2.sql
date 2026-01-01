-- 전기기사 필기 시험 문제 테이블 (업그레이드 버전)
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 과목명 (회로이론, 전력공학, 전기기기, 전기자기학 등)
  type TEXT NOT NULL CHECK (type IN ('암기', '공식')), -- 문제 유형
  question_text TEXT NOT NULL, -- 문제 지문
  options JSONB NOT NULL, -- 보기 4개 (JSON 배열)
  correct_answer TEXT NOT NULL, -- 정답
  explanation TEXT NOT NULL, -- 상세 해설
  cheat_key TEXT NOT NULL, -- 💡 핵심 치트키 (공식/요약)
  difficulty TEXT DEFAULT '중' CHECK (difficulty IN ('상', '중', '하')), -- 난이도
  source_file TEXT, -- 원본 PDF 파일명
  page_number INTEGER, -- PDF 페이지 번호
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);

-- 업데이트 시간 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_questions_updated_at 
  BEFORE UPDATE ON questions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 사용자 학습 진행률 테이블 (오답노트 기능용)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- 사용자 ID (향후 인증 시스템 연동)
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL, -- 정답 여부
  attempt_count INTEGER DEFAULT 1, -- 시도 횟수
  last_attempted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자별 문제별 인덱스
CREATE INDEX IF NOT EXISTS idx_user_progress_user_question 
  ON user_progress(user_id, question_id);
