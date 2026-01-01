'use client';

import { useState, useEffect } from 'react';
import { User, SavedNote } from '@/types';
import { getSavedNotes, deleteNote } from '@/lib/supabase';

interface Props { user: User; onClose: () => void; }

export default function MyPage({ user, onClose }: Props) {
    const [notes, setNotes] = useState<SavedNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'wrong_answer' | 'memo'>('all');

    useEffect(() => { load(); }, [user.id]);

    const load = async () => { setLoading(true); setNotes(await getSavedNotes(user.id)); setLoading(false); };
    const del = async (id: string) => { if (!confirm('삭제?')) return; await deleteNote(id); setNotes(notes.filter(n => n.id !== id)); };

    const filtered = notes.filter(n => filter === 'all' || n.note_type === filter);
    const wc = notes.filter(n => n.note_type === 'wrong_answer').length;
    const mc = notes.filter(n => n.note_type === 'memo').length;

    const t = { bg: '#1a1a1a', card: '#252525', border: '#333', input: '#2d2d2d', text: '#e0e0e0', muted: '#888', accent: '#4a9eff', success: '#4ade80', warning: '#fbbf24', error: '#f87171' };

    const btnStyle = (a: boolean) => ({ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${a ? t.accent : t.border}`, background: a ? 'rgba(74,158,255,0.15)' : t.input, fontSize: '13px', fontWeight: '500', color: a ? t.accent : t.muted, cursor: 'pointer' });

    return (
        <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${t.bg} 0%, #0d0d0d 100%)`, padding: '24px 16px', fontFamily: "'Pretendard Variable', sans-serif" }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: t.card, borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${t.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📚</div>
                        <div><div style={{ fontSize: '17px', fontWeight: '700', color: t.text }}>마이페이지</div><div style={{ fontSize: '12px', color: t.muted }}>{user.name}님의 학습 노트</div></div>
                    </div>
                    <button onClick={onClose} style={{ padding: '10px 16px', background: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', color: t.muted, fontSize: '13px', cursor: 'pointer' }}>돌아가기</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    {[{ icon: '❌', label: '오답', val: wc }, { icon: '📝', label: '메모', val: mc }, { icon: '📊', label: '전체', val: notes.length }].map((s, i) => (
                        <div key={i} style={{ background: t.card, borderRadius: '12px', padding: '20px', textAlign: 'center', border: `1px solid ${t.border}` }}>
                            <div style={{ fontSize: '28px', marginBottom: '4px' }}>{s.icon}</div>
                            <div style={{ fontSize: '26px', fontWeight: '700', color: t.text }}>{s.val}</div>
                            <div style={{ fontSize: '12px', color: t.muted }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    {[{ k: 'all', l: `전체 (${notes.length})` }, { k: 'wrong_answer', l: `오답 (${wc})` }, { k: 'memo', l: `메모 (${mc})` }].map(f => (
                        <button key={f.k} onClick={() => setFilter(f.k as any)} style={btnStyle(filter === f.k)}>{f.l}</button>
                    ))}
                </div>

                {loading ? <div style={{ textAlign: 'center', padding: '40px', color: t.muted }}>로딩 중...</div> : filtered.length === 0 ? <div style={{ textAlign: 'center', padding: '40px', color: t.muted }}>저장된 노트가 없습니다</div> : filtered.map(n => (
                    <div key={n.id} style={{ background: t.card, borderRadius: '12px', padding: '20px', marginBottom: '12px', border: `1px solid ${t.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', padding: '4px 8px', background: n.note_type === 'wrong_answer' ? 'rgba(248,113,113,0.1)' : 'rgba(74,158,255,0.1)', color: n.note_type === 'wrong_answer' ? t.error : t.accent, borderRadius: '4px', fontWeight: '500' }}>{n.note_type === 'wrong_answer' ? '오답' : '메모'}</span>
                            <button onClick={() => del(n.id)} style={{ background: 'none', border: 'none', color: t.muted, cursor: 'pointer', fontSize: '13px' }}>삭제</button>
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: '600', color: t.text, marginBottom: '12px', lineHeight: '1.6' }}>{n.question.question}</h3>
                        <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '8px', fontSize: '14px' }}><strong style={{ color: t.success }}>정답:</strong> <span style={{ color: t.text }}>{n.question.answer}</span></div>
                        <div style={{ background: t.input, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '12px', marginBottom: '8px', fontSize: '13px', color: t.text }}><strong>해설:</strong> {n.question.explanation}</div>
                        <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '8px', fontSize: '13px' }}><strong style={{ color: t.warning }}>치트키:</strong> <span style={{ color: t.text }}>{n.question.cheat_key}</span></div>
                        {n.memo && <div style={{ background: 'rgba(74,158,255,0.08)', border: '1px solid rgba(74,158,255,0.3)', borderRadius: '8px', padding: '12px', fontSize: '13px' }}><strong style={{ color: t.accent }}>메모:</strong> <span style={{ color: t.text }}>{n.memo}</span></div>}
                        <div style={{ fontSize: '11px', color: t.muted, marginTop: '12px' }}>{new Date(n.created_at).toLocaleString('ko-KR')}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
