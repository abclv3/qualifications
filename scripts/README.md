# PDF 데이터 추출 가이드

이 가이드는 `scripts/extract_pdf_data.py`를 사용하여 전기기사 PDF 파일에서 문제 데이터를 추출하는 방법을 설명합니다.

## 📋 사전 준비

### 1. Python 설치 확인
```bash
python --version
# Python 3.8 이상 필요
```

### 2. 가상환경 생성 (권장)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. 의존성 설치
```bash
cd scripts
pip install -r requirements.txt
```

## 🚀 실행 방법

### 옵션 1: Python 직접 실행
```bash
cd C:\di_portfolio\qualifications\scripts
python extract_pdf_data.py
```

### 옵션 2: 프로젝트 루트에서 실행
```bash
cd C:\di_portfolio\qualifications
python scripts\extract_pdf_data.py
```

## 📤 출력 결과

스크립트 실행 후 다음 파일이 생성됩니다:
- **파일명**: `questions_seed.json`
- **위치**: `C:\di_portfolio\qualifications\questions_seed.json`

### JSON 구조 예시
```json
[
  {
    "category": "회로이론",
    "type": "공식",
    "question_text": "저항 R에 전압 V를 가했을 때...",
    "options": ["I = V/R", "I = R/V", "I = V*R", "I = V^2/R"],
    "correct_answer": "I = V/R",
    "explanation": "전류는 전압에 비례하고...",
    "cheat_key": "💡 [치트키 01] 옴의 법칙: V=IR...",
    "difficulty": "중",
    "source_file": "[린치핀에듀]전기기사 필기 치트키(F)_rev0.PDF",
    "page_number": 1
  }
]
```

## 📊 추출 로직 설명

### 1. 문제 패턴 인식
- 문제 번호: `1.`, `2.`, `Q1.`, `문제 1` 등
- 보기: `①②③④`, `가나다라`, `1) 2) 3) 4)`
- 정답: `정답: 1`, `정답 ①` 등
- 해설: `해설:`, `설명:`, `풀이:` 등

### 2. 치트키 추출
다음 키워드가 포함된 부분을 치트키로 추출:
- `💡`, `치트키`, `Cheatkey`
- `꿀팁`, `핵심`, `Summary`
- `[공식]`, `★`
- 수식 패턴: `V=IR`, `F = 9×10^9` 등

### 3. 자동 분류
- **과목**: 키워드 기반 (회로이론, 전기자기학, 전기기기, 전력공학)
- **유형**: 공식 포함 여부로 판단
- **난이도**: 문제 길이와 키워드로 추론

## 🔧 문제 해결

### 오류 1: `ModuleNotFoundError: No module named 'pdfplumber'`
```bash
pip install pdfplumber
```

### 오류 2: 추출된 문제가 없음
PDF 파일이 다음 위치에 있는지 확인:
```
C:\di_portfolio\qualifications\
├── [린치핀에듀]전기기사 필기 치트키(F)_rev0.PDF
├── [따다] 전기기사 전과목 공식 모음집.pdf
└── 전기기사+필기.pdf
```

### 오류 3: 인코딩 에러
스크립트는 UTF-8 인코딩을 사용합니다. Windows에서 한글 경로 문제가 있다면:
```python
# extract_pdf_data.py 상단에 추가
import sys
sys.stdout.reconfigure(encoding='utf-8')
```

## 📌 다음 단계

### 1. JSON 파일 확인
``` bash
notepad questions_seed.json
# 또는
code questions_seed.json
```

### 2. Supabase에 데이터 삽입

#### 옵션 A: SQL 변환 (추천)
다음 Python 스크립트를 실행하여 JSON을 SQL로 변환:
```python
import json

with open('questions_seed.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

with open('insert_questions.sql', 'w', encoding='utf-8') as f:
    for q in questions:
        f.write(f"""
INSERT INTO questions (category, type, question_text, options, correct_answer, explanation, cheat_key, difficulty, source_file, page_number)
VALUES (
  '{q['category']}',
  '{q['type']}',
  '{q['question_text'].replace("'", "''")}',
  '{json.dumps(q['options'], ensure_ascii=False)}'::jsonb,
  '{q['correct_answer'].replace("'", "''")}',
  '{q['explanation'].replace("'", "''")}',
  '{q['cheat_key'].replace("'", "''")}',
  '{q['difficulty']}',
  '{q['source_file']}',
  {q['page_number']}
);
""")
```

#### 옵션 B: Supabase Dashboard 사용
1. Supabase Dashboard 접속
2. SQL Editor 열기
3. `schema_v2.sql` 실행 (테이블 생성)
4. `insert_questions.sql` 실행 (데이터 삽입)

### 3. Next.js 앱에서 확인
```bash
# .env.local 파일에 Supabase 정보 입력 후
npm run dev
```

## 💡 팁

### 수동 데이터 보정
자동 추출이 완벽하지 않을 수 있으므로, `questions_seed.json` 파일을 수동으로 검토하고 수정하세요:
- 보기가 올바르게 추출되었는지
- 정답이 정확한지
- 치트키가 제대로 추출되었는지

### 새로운 PDF 추가
새로운 PDF 파일을 `C:\di_portfolio\qualifications` 폴더에 추가한 후 스크립트를 다시 실행하면 됩니다.

---

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. Python 버전 (3.8+)
2. pdfplumber 설치 확인
3. PDF 파일 경로
4. PDF 파일이 텍스트로 되어 있는지 (스캔 이미지는 OCR 필요)
