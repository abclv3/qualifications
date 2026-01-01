'use client';

import { useState, useEffect } from 'react';
import { signUp, supabase } from '@/lib/supabase';
import { User } from '@/types';

interface SignUpProps { onSuccess: (user: User) => void; onBackToLogin: () => void; }

export default function SignUp({ onSuccess, onBackToLogin }: SignUpProps) {
    const [formData, setFormData] = useState({ username: '', name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // 실시간 검증 상태
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [passwordMatch, setPasswordMatch] = useState<'idle' | 'match' | 'mismatch'>('idle');

    // 아이디 중복 확인
    useEffect(() => {
        if (!formData.username.trim()) { setUsernameStatus('idle'); return; }
        const timer = setTimeout(async () => {
            setUsernameStatus('checking');
            try {
                if (!supabase) { setUsernameStatus('idle'); return; }
                const { data } = await supabase.from('users').select('username').eq('username', formData.username).maybeSingle();
                setUsernameStatus(data ? 'taken' : 'available');
            } catch { setUsernameStatus('idle'); }
        }, 500);
        return () => clearTimeout(timer);
    }, [formData.username]);

    // 비밀번호 일치 확인
    useEffect(() => {
        if (!formData.confirmPassword) { setPasswordMatch('idle'); return; }
        setPasswordMatch(formData.password === formData.confirmPassword ? 'match' : 'mismatch');
    }, [formData.password, formData.confirmPassword]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.username || !formData.name || !formData.email || !formData.password) { setError('모든 필드를 입력해주세요.'); return; }
        if (usernameStatus === 'taken') { setError('이미 사용 중인 아이디입니다.'); return; }
        if (formData.password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
        if (formData.password !== formData.confirmPassword) { setError('비밀번호가 일치하지 않습니다.'); return; }
        setLoading(true);
        try {
            const { data, error: signUpError } = await signUp(formData.email, formData.password, { username: formData.username, name: formData.name });
            if (signUpError) { setError((signUpError as any).message || '회원가입 실패'); setLoading(false); return; }
            if (data?.user) {
                const user: User = { id: data.user.id, username: formData.username, name: formData.name, email: formData.email, authId: data.user.id };
                sessionStorage.setItem('authenticated', 'true');
                sessionStorage.setItem('current-user', JSON.stringify(user));
                onSuccess(user);
            }
        } catch (err: any) { setError(err.message || '서버 연결 실패'); } finally { setLoading(false); }
    };

    // 청록색 테마
    const t = { bg: '#1a1a1a', card: '#252525', border: '#333', input: '#2d2d2d', inputBorder: '#404040', text: '#e0e0e0', muted: '#888', accent: '#14b8a6', accentDark: '#0d9488', success: '#4ade80', error: '#f87171' };

    const inputStyle = { width: '100%', height: '48px', padding: '0 14px', fontSize: '14px', background: t.input, border: `1px solid ${t.inputBorder}`, borderRadius: '10px', color: t.text, outline: 'none', boxSizing: 'border-box' as const };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: `linear-gradient(180deg, ${t.bg} 0%, #0d0d0d 100%)`, fontFamily: "'Pretendard Variable', sans-serif" }}>
            <div style={{ width: '100%', maxWidth: '400px', background: t.card, borderRadius: '20px', padding: '32px', border: `1px solid ${t.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                {/* 뒤로가기 버튼 */}
                <button onClick={onBackToLogin} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: t.muted, fontSize: '14px', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
                    <span style={{ fontSize: '18px' }}>←</span> 로그인으로 돌아가기
                </button>

                <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, margin: '0 0 8px 0', textAlign: 'center' }}>회원가입</h1>
                <p style={{ fontSize: '14px', color: t.muted, margin: '0 0 24px 0', textAlign: 'center' }}>전기기사 필기 학습을 시작하세요</p>

                {error && <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '10px', padding: '10px', marginBottom: '16px', textAlign: 'center', color: t.error, fontSize: '13px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* 아이디 - 중복 확인 */}
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: t.muted, marginBottom: '6px' }}>아이디</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="아이디를 입력하세요" style={{ ...inputStyle, borderColor: usernameStatus === 'available' ? t.success : usernameStatus === 'taken' ? t.error : t.inputBorder }} disabled={loading} />
                        {usernameStatus === 'checking' && <span style={{ fontSize: '12px', color: t.muted, marginTop: '4px', display: 'block' }}>⏳ 확인 중...</span>}
                        {usernameStatus === 'available' && <span style={{ fontSize: '12px', color: t.success, marginTop: '4px', display: 'block' }}>✅ 사용 가능한 아이디입니다</span>}
                        {usernameStatus === 'taken' && <span style={{ fontSize: '12px', color: t.error, marginTop: '4px', display: 'block' }}>❌ 이미 사용 중인 아이디입니다</span>}
                    </div>

                    {/* 이름 */}
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: t.muted, marginBottom: '6px' }}>이름</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름을 입력하세요" style={inputStyle} disabled={loading} />
                    </div>

                    {/* 이메일 */}
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: t.muted, marginBottom: '6px' }}>이메일</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" style={inputStyle} disabled={loading} />
                    </div>

                    {/* 비밀번호 */}
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: t.muted, marginBottom: '6px' }}>비밀번호</label>
                        <div style={{ position: 'relative' }}>
                            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="6자 이상" style={{ ...inputStyle, paddingRight: '40px' }} disabled={loading} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', opacity: 0.6 }}>{showPassword ? '🙈' : '👁️'}</button>
                        </div>
                        {formData.password && formData.password.length < 6 && <span style={{ fontSize: '12px', color: t.error, marginTop: '4px', display: 'block' }}>⚠️ 6자 이상 입력해주세요</span>}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: t.muted, marginBottom: '6px' }}>비밀번호 확인</label>
                        <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="비밀번호 재입력" style={{ ...inputStyle, borderColor: passwordMatch === 'match' ? t.success : passwordMatch === 'mismatch' ? t.error : t.inputBorder }} disabled={loading} />
                        {passwordMatch === 'match' && <span style={{ fontSize: '12px', color: t.success, marginTop: '4px', display: 'block' }}>✅ 비밀번호가 일치합니다</span>}
                        {passwordMatch === 'mismatch' && <span style={{ fontSize: '12px', color: t.error, marginTop: '4px', display: 'block' }}>❌ 비밀번호가 일치하지 않습니다</span>}
                    </div>

                    {/* 회원가입 버튼 - 청록색 */}
                    <button type="submit" disabled={loading || usernameStatus === 'taken' || passwordMatch === 'mismatch'} style={{ width: '100%', height: '50px', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDark} 100%)`, color: 'white', fontSize: '15px', fontWeight: '600', border: 'none', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', opacity: (loading || usernameStatus === 'taken' || passwordMatch === 'mismatch') ? 0.5 : 1, boxShadow: '0 4px 16px rgba(20, 184, 166, 0.3)' }}>{loading ? '가입 중...' : '회원가입'}</button>

                    <button type="button" onClick={onBackToLogin} style={{ width: '100%', height: '46px', background: t.input, color: t.muted, fontSize: '14px', border: `1px solid ${t.inputBorder}`, borderRadius: '12px', cursor: 'pointer' }}>이미 계정이 있으신가요? <span style={{ color: t.accent }}>로그인</span></button>
                </form>
            </div>
        </div>
    );
}
