'use client';

import { QuizResult } from '@/types';

interface ResultCardProps {
    result: QuizResult;
    onRestart: () => void;
    onShowWrongAnswers: () => void;
}

export default function ResultCard({ result, onRestart, onShowWrongAnswers }: ResultCardProps) {
    const { totalQuestions, correctAnswers, incorrectAnswers, score } = result;

    const getScoreColor = () => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-blue-400';
        if (score >= 40) return 'text-amber-400';
        return 'text-rose-400';
    };

    const getScoreMessage = () => {
        if (score >= 80) return '🎉 합격권입니다! 훌륭해요!';
        if (score >= 60) return '💪 조금만 더 힘내세요!';
        if (score >= 40) return '📚 복습이 필요해요!';
        return '🔥 기초부터 다시 시작하세요!';
    };

    return (
        <div className="glass-card p-8 space-y-8 max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 mb-4">
                    <span className="text-4xl">📊</span>
                </div>
                <h2 className="gradient-text text-3xl font-black">시험 결과</h2>
                <p className="text-gray-400 text-sm">{getScoreMessage()}</p>
            </div>

            {/* Score Circle */}
            <div className="flex justify-center">
                <div className="relative w-48 h-48">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="rgba(148, 163, 184, 0.1)"
                            strokeWidth="12"
                            fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${(score / 100) * 553} 553`}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0ea5e9" />
                                <stop offset="50%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#f59e0b" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {/* Score Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-5xl font-black ${getScoreColor()}`}>
                            {score}
                        </span>
                        <span className="text-gray-400 text-sm font-semibold mt-1">점</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/40 rounded-xl p-4 text-center border border-gray-700/50">
                    <div className="text-2xl font-black text-blue-400">{totalQuestions}</div>
                    <div className="text-xs text-gray-400 mt-1 font-semibold">총 문제</div>
                </div>
                <div className="bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-500/30">
                    <div className="text-2xl font-black text-emerald-400">{correctAnswers}</div>
                    <div className="text-xs text-gray-400 mt-1 font-semibold">정답</div>
                </div>
                <div className="bg-rose-500/10 rounded-xl p-4 text-center border border-rose-500/30">
                    <div className="text-2xl font-black text-rose-400">{incorrectAnswers}</div>
                    <div className="text-xs text-gray-400 mt-1 font-semibold">오답</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                    <span className="text-emerald-400">정답률</span>
                    <span className="text-gray-400">
                        {correctAnswers} / {totalQuestions}
                    </span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
                    />
                </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-xl p-5 border border-blue-500/20">
                <h4 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
                    <span>💡</span>
                    <span>학습 팁</span>
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>틀린 문제의 치트키를 반복해서 복습하세요.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-violet-400 mt-0.5">•</span>
                        <span>공식 문제는 직접 손으로 써가며 외우는 것이 효과적입니다.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>매일 10문제씩 풀면 2주 안에 실력이 향상됩니다.</span>
                    </li>
                </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                {incorrectAnswers > 0 && (
                    <button
                        onClick={onShowWrongAnswers}
                        className="btn-secondary w-full"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-rose-400 text-lg">📝</span>
                            <span>오답노트 보기 ({incorrectAnswers}개 오답)</span>
                        </div>
                    </button>
                )}
                <button onClick={onRestart} className="btn-primary w-full">
                    다시 풀기
                </button>
            </div>
        </div>
    );
}
