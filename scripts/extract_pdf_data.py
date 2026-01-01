"""
전기기사 PDF 파일에서 문제 데이터 추출 스크립트
경로: C:\\di_portfolio\\qualifications
대상 파일: *.pdf
출력: questions_seed.json
"""

import os
import json
import re
from pathlib import Path
from typing import List, Dict, Optional

try:
    import pdfplumber
except ImportError:
    print("⚠️  pdfplumber가 설치되지 않았습니다.")
    print("설치 명령: pip install pdfplumber")
    exit(1)


class PDFQuestionExtractor:
    def __init__(self, pdf_directory: str):
        self.pdf_directory = Path(pdf_directory)
        self.questions = []
        
        # 과목명 매핑 (파일명 또는 내용에서 추론)
        self.category_keywords = {
            '회로이론': ['회로이론', '회로', '옴', '키르히', 'KCL', 'KVL'],
            '전기자기학': ['전기자기학', '자기', '쿨롱', '전기장', '자기장', '맥스웰'],
            '전기기기': ['전기기기', '변압기', '전동기', '발전기', '유도기', '동기기'],
            '전력공학': ['전력공학', '송전', '배전', '코로나', '전력', '변전'],
        }
        
    def extract_all_pdfs(self) -> List[Dict]:
        """폴더 내 모든 PDF 파일 처리"""
        pdf_files = list(self.pdf_directory.glob('*.pdf')) + list(self.pdf_directory.glob('*.PDF'))
        
        print(f"📂 총 {len(pdf_files)}개의 PDF 파일 발견")
        
        for pdf_file in pdf_files:
            print(f"\n📄 처리 중: {pdf_file.name}")
            try:
                self._extract_from_pdf(pdf_file)
            except Exception as e:
                print(f"❌ 오류 발생: {pdf_file.name} - {str(e)}")
                continue
        
        print(f"\n✅ 총 {len(self.questions)}개의 문제 추출 완료")
        return self.questions
    
    def _extract_from_pdf(self, pdf_path: Path):
        """개별 PDF 파일에서 문제 추출"""
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, start=1):
                text = page.extract_text()
                if not text:
                    continue
                
                # 문제 패턴 찾기
                questions = self._parse_questions(text, pdf_path.name, page_num)
                self.questions.extend(questions)
    
    def _parse_questions(self, text: str, source_file: str, page_number: int) -> List[Dict]:
        """텍스트에서 문제 파싱"""
        questions = []
        
        # 문제 분리 패턴: "1.", "2.", "Q1.", "문제 1" 등
        question_pattern = r'(?:^|\n)(?:문제\s*)?(?:Q\.?\s*)?(\d+)[\.\)]\s*(.+?)(?=(?:^|\n)(?:문제\s*)?(?:Q\.?\s*)?\d+[\.\)]|$)'
        matches = re.finditer(question_pattern, text, re.MULTILINE | re.DOTALL)
        
        for match in matches:
            question_num = match.group(1)
            question_block = match.group(2).strip()
            
            question_data = self._parse_question_block(question_block, source_file, page_number)
            if question_data:
                questions.append(question_data)
        
        # 패턴이 없으면 치트키 추출 (공식집 PDF용)
        if not questions:
            cheatkeys = self._extract_cheatkeys(text, source_file, page_number)
            questions.extend(cheatkeys)
        
        return questions
    
    def _parse_question_block(self, block: str, source_file: str, page_number: int) -> Optional[Dict]:
        """개별 문제 블록 파싱"""
        
        # 1. 문제 지문 추출 (첫 줄 또는 보기 전까지)
        options_start = re.search(r'[①②③④⑤]|[가나다라마]\.|\d+\)', block)
        if options_start:
            question_text = block[:options_start.start()].strip()
        else:
            question_text = block.split('\n')[0].strip()
        
        if len(question_text) < 10:  # 너무 짧으면 무시
            return None
        
        # 2. 보기 추출
        options = self._extract_options(block)
        if len(options) < 2:  # 보기가 2개 미만이면 무시
            return None
        
        # 3. 정답 추출
        correct_answer = self._extract_answer(block, options)
        
        # 4. 해설 추출
        explanation = self._extract_explanation(block)
        
        # 5. 치트키 추출
        cheat_key = self._extract_cheatkey_from_block(block)
        
        # 6. 카테고리 추론
        category = self._infer_category(question_text + " " + cheat_key)
        
        # 7. 문제 유형 추론 (공식 포함 여부)
        question_type = '공식' if self._has_formula(question_text + cheat_key) else '암기'
        
        # 8. 난이도 추론
        difficulty = self._infer_difficulty(question_text)
        
        return {
            'category': category,
            'type': question_type,
            'question_text': question_text,
            'options': options,
            'correct_answer': correct_answer,
            'explanation': explanation,
            'cheat_key': cheat_key,
            'difficulty': difficulty,
            'source_file': source_file,
            'page_number': page_number,
        }
    
    def _extract_options(self, block: str) -> List[str]:
        """보기 추출"""
        options = []
        
        # 패턴 1: ①②③④
        pattern1 = r'[①②③④⑤]\s*([^\n①②③④⑤]+)'
        matches1 = re.findall(pattern1, block)
        if matches1:
            return [m.strip() for m in matches1][:4]
        
        # 패턴 2: 가, 나, 다, 라
        pattern2 = r'[가나다라마]\.\s*([^\n가나다라마]+)'
        matches2 = re.findall(pattern2, block)
        if matches2:
            return [m.strip() for m in matches2][:4]
        
        # 패턴 3: 1), 2), 3), 4)
        pattern3 = r'\d+\)\s*([^\n\d)]+)'
        matches3 = re.findall(pattern3, block)
        if matches3:
            return [m.strip() for m in matches3][:4]
        
        return options
    
    def _extract_answer(self, block: str, options: List[str]) -> str:
        """정답 추출"""
        # 패턴 1: "정답: 1" 또는 "정답 ①"
        answer_pattern = r'정답\s*[:：]?\s*([①②③④⑤1-4가나다라])'
        match = re.search(answer_pattern, block)
        if match:
            answer_text = match.group(1)
            # 번호를 실제 보기 텍스트로 변환
            answer_map = {'①': 0, '②': 1, '③': 2, '④': 3, '1': 0, '2': 1, '3': 2, '4': 3}
            if answer_text in answer_map and len(options) > answer_map[answer_text]:
                return options[answer_map[answer_text]]
        
        # 정답을 찾지 못하면 첫 번째 보기 반환
        return options[0] if options else "정답 없음"
    
    def _extract_explanation(self, block: str) -> str:
        """해설 추출"""
        explanation_pattern = r'(?:해설|설명|풀이)\s*[:：]?\s*([^\n]+(?:\n(?!치트키|정답|문제)[^\n]+)*)'
        match = re.search(explanation_pattern, block, re.MULTILINE)
        if match:
            return match.group(1).strip()
        
        return "해설이 제공되지 않았습니다."
    
    def _extract_cheatkey_from_block(self, block: str) -> str:
        """치트키 추출"""
        # 치트키 키워드 검색
        cheatkey_patterns = [
            r'(?:💡|치트키|Cheatkey|꿀팁|핵심|Summary)\s*[:：]?\s*([^\n]+(?:\n(?!문제|정답|해설)[^\n]+)*)',
            r'\[공식\]\s*([^\n]+(?:\n[^\n]+)*)',
            r'★\s*([^\n]+)',
        ]
        
        for pattern in cheatkey_patterns:
            match = re.search(pattern, block, re.MULTILINE | re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        # 공식 패턴 찾기
        formula_pattern = r'([A-Za-z]\s*=\s*[^,\n]+)'
        formulas = re.findall(formula_pattern, block)
        if formulas:
            return "💡 공식: " + " | ".join(formulas[:3])
        
        return "핵심 내용을 복습하세요."
    
    def _extract_cheatkeys(self, text: str, source_file: str, page_number: int) -> List[Dict]:
        """공식집 PDF에서 치트키 추출 (문제가 없는 경우)"""
        cheatkeys = []
        
        # "Cheatkey N" 패턴 찾기
        cheatkey_pattern = r'(?:Cheatkey|치트키)\s*(\d+)\s*[:\-]?\s*(.+?)(?=(?:Cheatkey|치트키)\s*\d+|$)'
        matches = re.finditer(cheatkey_pattern, text, re.MULTILINE | re.DOTALL | re.IGNORECASE)
        
        for match in matches:
            cheatkey_num = match.group(1)
            cheatkey_content = match.group(2).strip()[:500]  # 최대 500자
            
            # 해당 치트키로 문제 생성 (간단한 암기 문제)
            category = self._infer_category(cheatkey_content)
            question_type = '공식' if self._has_formula(cheatkey_content) else '암기'
            
            # 간단한 문제 생성
            question_data = {
                'category': category,
                'type': question_type,
                'question_text': f"{category} 관련 핵심 개념을 설명하시오.",
                'options': ["선택지 1", "선택지 2", "선택지 3", "선택지 4"],
                'correct_answer': "선택지 1",
                'explanation': f"치트키 {cheatkey_num} 참조",
                'cheat_key': f"💡 {cheatkey_content}",
                'difficulty': '중',
                'source_file': source_file,
                'page_number': page_number,
            }
            cheatkeys.append(question_data)
        
        return cheatkeys
    
    def _infer_category(self, text: str) -> str:
        """텍스트에서 과목 추론"""
        for category, keywords in self.category_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    return category
        return '기타'
    
    def _has_formula(self, text: str) -> bool:
        """공식 포함 여부 확인"""
        formula_indicators = [
            r'[A-Z]\s*=\s*',  # V = IR
            r'\d+\s*×\s*10\^',  # 9×10^9
            r'√',  # 루트
            r'[∫∂∑∏]',  # 적분, 편미분, 시그마 등
            r'sin|cos|tan|log',  # 삼각함수, 로그
        ]
        return any(re.search(pattern, text) for pattern in formula_indicators)
    
    def _infer_difficulty(self, text: str) -> str:
        """난이도 추론"""
        # 간단한 휴리스틱
        if len(text) > 200 or '계산' in text or '유도' in text:
            return '상'
        elif len(text) < 80:
            return '하'
        return '중'
    
    def save_to_json(self, output_file: str = 'questions_seed.json'):
        """JSON 파일로 저장"""
        output_path = self.pdf_directory / output_file
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.questions, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 저장 완료: {output_path}")
        print(f"📊 총 {len(self.questions)}개 문제")
        
        # 통계 출력
        categories = {}
        types = {}
        for q in self.questions:
            categories[q['category']] = categories.get(q['category'], 0) + 1
            types[q['type']] = types.get(q['type'], 0) + 1
        
        print("\n📈 과목별 통계:")
        for cat, count in categories.items():
            print(f"  - {cat}: {count}개")
        
        print("\n📈 유형별 통계:")
        for typ, count in types.items():
            print(f"  - {typ}: {count}개")


def main():
    """메인 실행 함수"""
    print("=" * 60)
    print("⚡ 전기기사 PDF 문제 추출 스크립트")
    print("=" * 60)
    
    # PDF 폴더 경로
    pdf_directory = r"C:\di_portfolio\qualifications"
    
    # 폴더 존재 확인
    if not os.path.exists(pdf_directory):
        print(f"❌ 폴더가 존재하지 않습니다: {pdf_directory}")
        return
    
    # 추출 시작
    extractor = PDFQuestionExtractor(pdf_directory)
    extractor.extract_all_pdfs()
    extractor.save_to_json()
    
    print("\n✅ 완료! questions_seed.json 파일을 확인하세요.")
    print("📌 다음 단계: Supabase SQL Editor에 데이터 업로드")


if __name__ == "__main__":
    main()
