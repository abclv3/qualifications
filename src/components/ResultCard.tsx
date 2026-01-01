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
        if (score >= 80) return '#4ade80';
        if (score >= 60) return '#14b8a6';
        if (score >= 40) return '#fbbf24';
        return '#f87171';
    };

    const getMessage = () => {
        if (score >= 80) return { emoji: '🎉', text: '합격권입니다! 훌륭해요!' };
        if (score >= 60) return { emoji: '💪', text: '조금만 더 힘내세요!' };
        if (score >= 40) return { emoji: '📚', text: '복습이 필요해요!' };
        return { emoji: '🔥', text: '기초부터 다시 시작하세요!' };
    };

    const t = { bg: '#1a1a1a', card: '#252525', border: '#333', text: '#e0e0e0', muted: '#888', accent: '#14b8a6', success: '#4ade80', error: '#f87171', warning: '#fbbf24' };
    const msg = getMessage();

    return (
        <div style={{ background: t.card, borderRadius: '20px', padding: '32px', maxWidth: '500px', margin: '0 auto', border: `1px solid ${t.border}` }}>
            {/* 헤더 */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: t.text, margin: '0 0 8px 0' }}>시험 결과</h2>
                <p style={{ fontSize: '15px', color: t.muted, margin: 0 }}>{msg.emoji} {msg.text}</p>
            </div>

            {/* 점수 원형 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                    <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="90" cy="90" r="80" fill="none" stroke={t.border} strokeWidth="12" />
                        <circle cx="90" cy="90" r="80" fill="none" stroke={getScoreColor()} strokeWidth="12"
                            strokeDasharray={`${(score / 100) * 502} 502`}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 1s ease' }}
                        />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '48px', fontWeight: '800', color: getScoreColor() }}>{score}</span>
                        <span style={{ fontSize: '14px', color: t.muted }}>점</span>
                    </div>
                </div>
            </div>

            {/* 통계 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: t.bg, borderRadius: '12px', padding: '16px', textAlign: 'center', border: `1px solid ${t.border}` }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: t.accent }}>{totalQuestions}</div>
                    <div style={{ fontSize: '12px', color: t.muted }}>총 문제</div>
                </div>
                <div style={{ background: 'rgba(74,222,128,0.1)', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid rgba(74,222,128,0.3)' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: t.success }}>{correctAnswers}</div>
                    <div style={{ fontSize: '12px', color: t.muted }}>정답</div>
                </div>
                <div style={{ background: 'rgba(248,113,113,0.1)', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid rgba(248,113,113,0.3)' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: t.error }}>{incorrectAnswers}</div>
                    <div style={{ fontSize: '12px', color: t.muted }}>오답</div>
                </div>
            </div>

            {/* 정답률 바 */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                    <span style={{ color: t.success, fontWeight: '600' }}>정답률</span>
                    <span style={{ color: t.muted }}>{correctAnswers} / {totalQuestions}</span>
                </div>
                <div style={{ height: '10px', background: t.border, borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(correctAnswers / totalQuestions) * 100}%`, background: `linear-gradient(90deg, ${t.accent}, ${t.success})`, borderRadius: '5px', transition: 'width 0.5s' }} />
                </div>
            </div>

            {/* 학습 팁 */}
            <div style={{ background: 'rgba(20,184,166,0.08)', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: '1px solid rgba(20,184,166,0.2)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: t.accent, margin: '0 0 12px 0' }}>💡 학습 팁</h4>
                <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '13px', color: t.text, lineHeight: '1.8' }}>
                    <li>틀린 문제의 치트키를 반복해서 복습하세요.</li>
                    <li>공식 문제는 직접 손으로 써가며 외우세요.</li>
                    <li>매일 10문제씩 풀면 2주 안에 실력이 향상됩니다.</li>
                </ul>
            </div>

            {/* 버튼들 */}
            <div>
                {incorrectAnswers > 0 && (
                    <button onClick={onShowWrongAnswers} style={{ width: '100%', padding: '16px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: '12px', color: t.text, fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        📝 <span>오답노트 보기 ({incorrectAnswers}개 오답)</span>
                    </button>
                )}
                <button onClick={onRestart} style={{ width: '100%', padding: '16px', background: `linear-gradient(135deg, ${t.accent} 0%, #0d9488 100%)`, border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                    다시 풀기
                </button>
            </div>
        </div>
    );
}
