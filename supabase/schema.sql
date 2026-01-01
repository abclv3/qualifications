-- 전기기사 필기 시험 문제 테이블
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 과목명 (예: 회로이론, 전기자기학, 전기기기, 전력공학)
  type TEXT NOT NULL, -- 문제 유형 (암기/공식)
  question TEXT NOT NULL, -- 문제 지문
  options JSONB NOT NULL, -- 보기 4개 (JSON 배열)
  answer TEXT NOT NULL, -- 정답
  explanation TEXT NOT NULL, -- 상세 해설
  cheat_key TEXT NOT NULL, -- 핵심 치트키 텍스트
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);

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
