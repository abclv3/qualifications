'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/types';

interface QuizCardProps { question: Question; questionNumber: number; totalQuestions: number; onAnswer: (q: string, a: string, c: boolean) => void; showResult: boolean; }

export default function QuizCard({ question, questionNumber, totalQuestions, onAnswer }: QuizCardProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);

    useEffect(() => { setSelectedOption(null); setHasAnswered(false); }, [questionNumber, question.id]);

    const handleOptionClick = (option: string) => {
        if (hasAnswered) return;
        setSelectedOption(option);
        setHasAnswered(true);
        onAnswer(question.id, option, option === question.answer);
    };

    const handleSaveToNote = async () => {
        const userStr = sessionStorage.getItem('current-user');
        if (!userStr) { alert('로그인 필요'); return; }
        const user = JSON.parse(userStr);
        const memo = prompt('메모 입력 (선택):');
        const { saveNote } = await import('@/lib/supabase');
        const { error } = await saveNote(user.id, question.id, 'memo', selectedOption || undefined, memo || undefined);
        alert(error ? '저장 실패' : '✅ 저장됨!');
    };

    const t = { bg: '#1a1a1a', card: '#252525', border: '#333', input: '#2d2d2d', text: '#e0e0e0', muted: '#888', accent: '#4a9eff', success: '#4ade80', error: '#f87171', warning: '#fbbf24' };

    const categoryColors: Record<string, string> = { '회로이론 및 제어공학': '#60a5fa', '전기자기학': '#4ade80', '전기기기': '#fbbf24', '전력공학': '#a78bfa', '전기설비기술기준': '#f472b6' };
    const catColor = categoryColors[question.category] || t.muted;

    return (
        <div style={{ background: t.card, borderRadius: '16px', padding: '24px', border: `1px solid ${t.border}`, maxWidth: '720px', margin: '0 auto' }}>
            {/* 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: `1px solid ${t.border}`, marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', background: `${catColor}20`, color: catColor }}>{question.category}</span>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', background: question.type === '공식' ? 'rgba(251,191,36,0.15)' : 'rgba(96,165,250,0.15)', color: question.type === '공식' ? t.warning : t.accent }}>{question.type}</span>
                </div>
                <span style={{ fontSize: '14px', color: t.muted }}>{questionNumber} / {totalQuestions}</span>
            </div>

            {/* 문제 */}
            <div style={{ fontSize: '17px', fontWeight: '600', color: t.text, lineHeight: '1.7', marginBottom: '24px' }}>{question.question}</div>

            {/* 선택지 */}
            <div>
                {question.options.map((option, i) => {
                    let bg = t.input, border = t.border, opacity = 1;
                    if (hasAnswered) {
                        if (option === question.answer) { bg = 'rgba(74,222,128,0.1)'; border = t.success; }
                        else if (option === selectedOption) { bg = 'rgba(248,113,113,0.1)'; border = t.error; }
                        else { opacity = 0.4; }
                    }
                    return (
                        <button key={i} onClick={() => handleOptionClick(option)} disabled={hasAnswered} style={{ width: '100%', textAlign: 'left', padding: '14px 16px', marginBottom: '10px', background: bg, border: `1px solid ${border}`, borderRadius: '10px', color: t.text, fontSize: '15px', cursor: hasAnswered ? 'default' : 'pointer', opacity, transition: 'all 0.15s' }}>
                            <span style={{ display: 'inline-block', width: '26px', height: '26px', borderRadius: '6px', background: t.border, textAlign: 'center', lineHeight: '26px', marginRight: '12px', fontSize: '13px', fontWeight: '600' }}>{String.fromCharCode(65 + i)}</span>
                            {option}
                            {hasAnswered && option === question.answer && <span style={{ float: 'right', color: t.success, fontWeight: '600' }}>✓ 정답</span>}
                            {hasAnswered && option === selectedOption && option !== question.answer && <span style={{ float: 'right', color: t.error, fontWeight: '600' }}>✗ 오답</span>}
                        </button>
                    );
                })}
            </div>

            {/* 해설 영역 */}
            {hasAnswered && (
                <div style={{ marginTop: '24px' }}>
                    <div style={{ background: 'rgba(74,222,128,0.08)', border: `1px solid rgba(74,222,128,0.3)`, borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: t.success, display: 'block', marginBottom: '6px' }}>✅ 정답</span>
                        <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: t.text }}>{question.answer}</p>
                    </div>
                    <div style={{ background: t.input, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: t.muted, display: 'block', marginBottom: '6px' }}>📖 해설</span>
                        <p style={{ margin: 0, fontSize: '14px', color: t.text, lineHeight: '1.7' }}>{question.explanation}</p>
                    </div>
                    <div style={{ background: 'rgba(251,191,36,0.08)', border: `1px solid rgba(251,191,36,0.3)`, borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: t.warning, display: 'block', marginBottom: '6px' }}>💡 치트키</span>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: t.text }}>{question.cheat_key}</p>
                    </div>
                    {question.strategy && (
                        <div style={{ background: 'rgba(74,158,255,0.08)', border: `1px solid rgba(74,158,255,0.3)`, borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: t.accent, display: 'block', marginBottom: '6px' }}>📋 풀이 전략 ({question.type})</span>
                            <p style={{ margin: 0, fontSize: '14px', color: t.text }}>{question.strategy}</p>
                        </div>
                    )}
                    <button onClick={handleSaveToNote} style={{ width: '100%', padding: '14px', background: t.input, border: `1px solid ${t.border}`, borderRadius: '10px', color: t.muted, fontSize: '14px', cursor: 'pointer' }}>📌 마이페이지에 저장</button>
                </div>
            )}
        </div>
    );
}
