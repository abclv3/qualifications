'use client';

import { Question, UserAnswer } from '@/types';

interface WrongAnswersProps {
    questions: Question[];
    userAnswers: UserAnswer[];
    onClose: () => void;
}

export default function WrongAnswersNote({ questions, userAnswers, onClose }: WrongAnswersProps) {
    const wrongAnswers = userAnswers.filter((a) => !a.isCorrect);
    const wrongQuestions = questions.filter((q) => wrongAnswers.some((wa) => wa.questionId === q.id));

    const t = { bg: '#1a1a1a', card: '#252525', border: '#333', text: '#e0e0e0', muted: '#888', accent: '#14b8a6', success: '#4ade80', error: '#f87171', warning: '#fbbf24' };

    const getCategoryColor = (cat: string) => {
        const colors: Record<string, string> = { '회로이론 및 제어공학': '#60a5fa', '전기자기학': '#4ade80', '전기기기': '#fbbf24', '전력공학': '#a78bfa', '전기설비기술기준': '#f472b6' };
        return colors[cat] || t.muted;
    };

    if (wrongQuestions.length === 0) {
        return (
            <div style={{ background: t.card, borderRadius: '16px', padding: '48px', maxWidth: '500px', margin: '0 auto', textAlign: 'center', border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: t.success, margin: '0 0 8px 0' }}>완벽합니다!</h2>
                <p style={{ color: t.muted, marginBottom: '24px' }}>틀린 문제가 없습니다.</p>
                <button onClick={onClose} style={{ padding: '14px 32px', background: `linear-gradient(135deg, ${t.accent} 0%, #0d9488 100%)`, color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>돌아가기</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* 헤더 */}
            <div style={{ background: t.card, borderRadius: '12px', padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${t.border}` }}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: t.text, margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>📝 오답노트</h2>
                    <p style={{ fontSize: '14px', color: t.muted, margin: 0 }}>틀린 문제 <span style={{ color: t.error, fontWeight: '600' }}>{wrongQuestions.length}개</span>의 핵심 치트키를 복습하세요</p>
                </div>
                <button onClick={onClose} style={{ padding: '10px 20px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: '10px', color: t.text, fontSize: '14px', cursor: 'pointer' }}>돌아가기</button>
            </div>

            {/* 오답 목록 */}
            {wrongQuestions.map((q, idx) => {
                const ua = wrongAnswers.find((wa) => wa.questionId === q.id);
                const catColor = getCategoryColor(q.category);

                return (
                    <div key={q.id} style={{ background: t.card, borderRadius: '16px', padding: '24px', marginBottom: '16px', border: `1px solid ${t.border}` }}>
                        {/* 뱃지 */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(248,113,113,0.15)', color: t.error, fontSize: '12px', fontWeight: '600' }}>오답 {idx + 1}</span>
                            <span style={{ padding: '4px 10px', borderRadius: '6px', background: `${catColor}20`, color: catColor, fontSize: '12px', fontWeight: '600' }}>{q.category}</span>
                            <span style={{ padding: '4px 10px', borderRadius: '6px', background: q.type === '공식' ? 'rgba(251,191,36,0.15)' : 'rgba(96,165,250,0.15)', color: q.type === '공식' ? t.warning : '#60a5fa', fontSize: '12px', fontWeight: '600' }}>{q.type}</span>
                        </div>

                        {/* 문제 */}
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: t.text, lineHeight: '1.7', marginBottom: '20px' }}>{q.question}</h3>

                        {/* 내 답 vs 정답 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ background: 'rgba(248,113,113,0.08)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(248,113,113,0.2)' }}>
                                <div style={{ fontSize: '12px', fontWeight: '600', color: t.error, marginBottom: '6px' }}>✗ 내 답</div>
                                <div style={{ fontSize: '14px', color: t.text }}>{ua?.selectedAnswer}</div>
                            </div>
                            <div style={{ background: 'rgba(74,222,128,0.08)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(74,222,128,0.2)' }}>
                                <div style={{ fontSize: '12px', fontWeight: '600', color: t.success, marginBottom: '6px' }}>✓ 정답</div>
                                <div style={{ fontSize: '14px', color: t.text }}>{q.answer}</div>
                            </div>
                        </div>

                        {/* 해설 */}
                        <div style={{ background: t.bg, borderRadius: '10px', padding: '14px', marginBottom: '12px', border: `1px solid ${t.border}` }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#60a5fa', marginBottom: '6px' }}>📘 해설</div>
                            <div style={{ fontSize: '14px', color: t.text, lineHeight: '1.6' }}>{q.explanation}</div>
                        </div>

                        {/* 치트키 */}
                        <div style={{ background: 'rgba(251,191,36,0.1)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(251,191,36,0.3)' }}>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: t.warning, marginBottom: '8px' }}>💡 핵심 치트키 (반드시 암기!)</div>
                            <div style={{ fontSize: '15px', fontWeight: '600', color: t.text, lineHeight: '1.6' }}>{q.cheat_key}</div>
                        </div>
                    </div>
                );
            })}

            {/* 하단 */}
            <div style={{ background: t.card, borderRadius: '12px', padding: '24px', textAlign: 'center', border: `1px solid ${t.border}` }}>
                <p style={{ color: t.muted, marginBottom: '16px', fontSize: '14px' }}>위 치트키를 모두 암기했다면 다시 도전해보세요!</p>
                <button onClick={onClose} style={{ padding: '14px 40px', background: `linear-gradient(135deg, ${t.accent} 0%, #0d9488 100%)`, color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>돌아가기</button>
            </div>
        </div>
    );
}
