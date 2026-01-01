'use client';

import { Category, QuestionType } from '@/types';

interface Props { selectedCategory: Category; selectedType: QuestionType; onCategoryChange: (c: Category) => void; onTypeChange: (t: QuestionType) => void; }

const categories: Category[] = ['전체', '회로이론 및 제어공학', '전기자기학', '전기기기', '전력공학', '전기설비기술기준'];
const types: QuestionType[] = ['전체', '암기', '공식'];

export default function FilterBar({ selectedCategory, selectedType, onCategoryChange, onTypeChange }: Props) {
    const t = { card: '#252525', border: '#333', input: '#2d2d2d', text: '#e0e0e0', muted: '#888', accent: '#4a9eff' };

    const btnStyle = (active: boolean) => ({
        padding: '8px 14px', borderRadius: '8px', border: `1px solid ${active ? t.accent : t.border}`,
        background: active ? 'rgba(74,158,255,0.15)' : t.input, fontSize: '13px', fontWeight: '500',
        color: active ? t.accent : t.muted, cursor: 'pointer', transition: 'all 0.15s'
    });

    return (
        <div style={{ background: t.card, borderRadius: '12px', padding: '20px', marginBottom: '20px', border: `1px solid ${t.border}` }}>
            <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: t.muted, marginBottom: '10px', display: 'block' }}>📚 과목 선택</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {categories.map((c) => <button key={c} onClick={() => onCategoryChange(c)} style={btnStyle(selectedCategory === c)}>{c}</button>)}
                </div>
            </div>
            <div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: t.muted, marginBottom: '10px', display: 'block' }}>🎯 문제 유형</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {types.map((t2) => <button key={t2} onClick={() => onTypeChange(t2)} style={btnStyle(selectedType === t2)}>{t2}</button>)}
                </div>
            </div>
        </div>
    );
}
