'use client';

import { useState } from 'react';
import { signIn, getEmailByUsername, getUserByAuthId } from '@/lib/supabase';
import { User } from '@/types';

interface LoginProps { onSuccess: (user: User) => void; onSignUp: () => void; }

export default function Login({ onSuccess, onSignUp }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username.trim() || !password.trim()) { setError('아이디와 비밀번호를 입력하세요'); return; }
        setLoading(true);
        try {
            let userEmail = username;
            if (!username.includes('@')) {
                const email = await getEmailByUsername(username);
                if (!email) { setError('존재하지 않는 아이디입니다.'); setLoading(false); return; }
                userEmail = email;
            }
            const { data, error: authError } = await signIn(userEmail, password);
            if (authError || !data?.user) { setError('아이디 또는 비밀번호가 올바르지 않습니다.'); setLoading(false); return; }
            const userData = await getUserByAuthId(data.user.uid);
            const user = userData || { id: data.user.uid, username, name: username, email: userEmail, authId: data.user.uid };
            sessionStorage.setItem('authenticated', 'true');
            sessionStorage.setItem('current-user', JSON.stringify(user));
            onSuccess(user as User);
        } catch { setError('서버 연결 실패'); } finally { setLoading(false); }
    };

    // 청록색 다크 메탈릭 테마
    const t = { bg: '#1a1a1a', card: '#252525', border: '#333', input: '#2d2d2d', inputBorder: '#404040', text: '#e0e0e0', muted: '#888', accent: '#14b8a6', accentDark: '#0d9488', success: '#4ade80', error: '#f87171' };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: `linear-gradient(180deg, ${t.bg} 0%, #0d0d0d 100%)`, fontFamily: "'Pretendard Variable', sans-serif" }}>
            <div style={{ width: '100%', maxWidth: '400px', background: t.card, borderRadius: '20px', padding: '40px 32px', border: `1px solid ${t.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                {/* 로고 */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '72px', height: '72px', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDark} 100%)`, borderRadius: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '36px', boxShadow: '0 8px 24px rgba(20, 184, 166, 0.3)' }}>⚡</div>
                    <h1 style={{ fontSize: '26px', fontWeight: '700', color: t.text, margin: '0 0 8px 0' }}>전기기사 필기</h1>
                    <p style={{ fontSize: '14px', color: t.muted, margin: 0 }}>스마트한 학습 시스템</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '10px', padding: '12px', marginBottom: '20px', textAlign: 'center' }}>
                        <span style={{ color: t.error, fontSize: '14px' }}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: t.muted, marginBottom: '8px' }}>아이디</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디를 입력하세요" disabled={loading}
                            style={{ width: '100%', height: '52px', padding: '0 16px', fontSize: '15px', background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: '12px', color: t.text, outline: 'none', boxSizing: 'border-box' }}
                            onFocus={(e) => e.target.style.borderColor = t.accent}
                            onBlur={(e) => e.target.style.borderColor = t.inputBorder}
                        />
                    </div>
                    <div style={{ marginBottom: '28px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: t.muted, marginBottom: '8px' }}>비밀번호</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" disabled={loading}
                                style={{ width: '100%', height: '52px', padding: '0 50px 0 16px', fontSize: '15px', background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: '12px', color: t.text, outline: 'none', boxSizing: 'border-box' }}
                                onFocus={(e) => e.target.style.borderColor = t.accent}
                                onBlur={(e) => e.target.style.borderColor = t.inputBorder}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', opacity: 0.6 }}>{showPassword ? '🙈' : '👁️'}</button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} style={{ width: '100%', height: '54px', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDark} 100%)`, color: 'white', fontSize: '16px', fontWeight: '600', border: 'none', borderRadius: '12px', cursor: 'pointer', marginBottom: '12px', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 16px rgba(20, 184, 166, 0.3)' }}>{loading ? '로그인 중...' : '로그인'}</button>
                    <button type="button" onClick={onSignUp} style={{ width: '100%', height: '50px', background: t.input, color: t.muted, fontSize: '14px', fontWeight: '500', border: `1px solid ${t.inputBorder}`, borderRadius: '12px', cursor: 'pointer' }}>계정이 없으신가요? <span style={{ color: t.accent }}>회원가입</span></button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '28px' }}>
                    <p style={{ fontSize: '12px', color: t.muted, margin: '0 0 4px 0' }}>전기기사 필기시험 학습 전용 시스템</p>
                    <p style={{ fontSize: '12px', color: t.success, margin: 0 }}>✓ 클라우드 동기화 지원</p>
                </div>
            </div>
        </div>
    );
}
