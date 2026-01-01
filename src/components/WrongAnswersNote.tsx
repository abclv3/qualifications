'use client';

import { Question, UserAnswer } from '@/types';

interface WrongAnswersProps {
    questions: Question[];
    userAnswers: UserAnswer[];
    onClose: () => void;
}

export default function WrongAnswersNote({ questions, userAnswers, onClose }: WrongAnswersProps) {
    // 틀린 문제만 필터링
    const wrongAnswers = userAnswers.filter((answer) => !answer.isCorrect);
    const wrongQuestions = questions.filter((q) =>
        wrongAnswers.some((wa) => wa.questionId === q.id)
    );

    if (wrongQuestions.length === 0) {
        return (
            <div className="glass-card p-8 max-w-4xl mx-auto text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-emerald-400 mb-2">완벽합니다!</h2>
                <p className="text-gray-400 mb-6">틀린 문제가 없습니다.</p>
                <button onClick={onClose} className="btn-primary">
                    돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            <span className="text-3xl">📝</span>
                            <span>오답노트</span>
                        </h2>
                        <p className="text-gray-400">
                            틀린 문제 <span className="text-rose-400 font-bold">{wrongQuestions.length}개</span>의 핵심 치트키를 복습하세요
                        </p>
                    </div>
                    <button onClick={onClose} className="btn-secondary">
                        돌아가기
                    </button>
                </div>
            </div>

            {/* Wrong Questions List */}
            {wrongQuestions.map((question, index) => {
                const userAnswer = wrongAnswers.find((wa) => wa.questionId === question.id);

                return (
                    <div key={question.id} className="glass-card p-8 space-y-6">
                        {/* Question Header */}
                        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-700/50">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="badge badge-rose">오답 {index + 1}</span>
                                <span className={`badge ${getCategoryBadgeClass(question.category)}`}>
                                    {question.category}
                                </span>
                                <span className={`badge ${question.type === '공식' ? 'badge-violet' : 'badge-blue'}`}>
                                    {question.type}
                                </span>
                            </div>
                        </div>

                        {/* Question */}
                        <div>
                            <h3 className="text-lg font-bold text-white leading-relaxed mb-4">
                                {question.question}
                            </h3>
                        </div>

                        {/* Your Answer vs Correct Answer */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Wrong Answer */}
                            <div className="bg-rose-500/10 rounded-xl p-5 border border-rose-500/30">
                                <h4 className="text-sm font-bold text-rose-400 mb-2 flex items-center gap-2">
                                    <span>✗</span>
                                    <span>내 답</span>
                                </h4>
                                <p className="text-base text-gray-200">{userAnswer?.selectedAnswer}</p>
                            </div>

                            {/* Correct Answer */}
                            <div className="bg-emerald-500/10 rounded-xl p-5 border border-emerald-500/30">
                                <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                                    <span>✓</span>
                                    <span>정답</span>
                                </h4>
                                <p className="text-base text-gray-200">{question.answer}</p>
                            </div>
                        </div>

                        {/* Explanation */}
                        <div className="bg-gray-800/40 rounded-xl p-5 border border-gray-700/50">
                            <h4 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                                <span>📘</span>
                                <span>해설</span>
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-300">{question.explanation}</p>
                        </div>

                        {/* Cheat Key - 형광펜 효과 */}
                        <div className="cheat-key-box">
                            <div className="flex items-start gap-3">
                                <div className="text-3xl">💡</div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-amber-300 mb-3 uppercase tracking-wider">
                                        핵심 치트키 (반드시 암기!)
                                    </h4>
                                    <p className="text-lg font-bold text-white leading-relaxed">
                                        {question.cheat_key}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Study Tip */}
                        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                            <p className="text-sm text-blue-200 flex items-start gap-2">
                                <span className="text-blue-400 mt-0.5">💬</span>
                                <span>이 치트키를 손으로 3번 써보고 큰 소리로 읽어보세요!</span>
                            </p>
                        </div>
                    </div>
                );
            })}

            {/* Footer Actions */}
            <div className="glass-card p-6 text-center">
                <p className="text-gray-400 mb-4">
                    위 치트키를 모두 암기했다면 다시 한 번 도전해보세요!
                </p>
                <button onClick={onClose} className="btn-primary">
                    다시 풀기
                </button>
            </div>
        </div>
    );
}

function getCategoryBadgeClass(category: string): string {
    switch (category) {
        case '회로이론':
            return 'badge-blue';
        case '전기자기학':
            return 'badge-violet';
        case '전기기기':
            return 'badge-amber';
        case '전력공학':
            return 'badge-emerald';
        default:
            return 'badge-blue';
    }
}
