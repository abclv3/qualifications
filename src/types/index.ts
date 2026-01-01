export interface Question {
    id: string;
    category: string; // 과목명
    type: string; // 문제 유형 (암기/공식)
    question: string; // 문제 지문
    options: string[]; // 보기 배열
    answer: string; // 정답
    explanation: string; // 상세 해설
    cheat_key: string; // 핵심 치트키
    strategy?: string; // 문제 풀이 전략 (핵심 접근법)
    created_at: string;
    updated_at: string;
}

export interface UserAnswer {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
}

export interface QuizResult {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    score: number; // 백분율
    answers: UserAnswer[];
}

export type Category = '전체' | '회로이론 및 제어공학' | '전기자기학' | '전기기기' | '전력공학' | '전기설비기술기준';
export type QuestionType = '전체' | '암기' | '공식';

// 사용자 정보
export interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    authId: string;
    created_at?: string;
}

// 저장된 노트 (오답노트/메모장)
export interface SavedNote {
    id: string;
    user_id: string;
    question_id: string;
    question: Question;
    note_type: 'wrong_answer' | 'memo'; // 오답노트 or 일반 메모
    user_answer?: string; // 사용자가 선택한 답 (오답노트인 경우)
    memo?: string; // 사용자 메모
    created_at: string;
    updated_at: string;
}
