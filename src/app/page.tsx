'use client';

import { useState, useEffect } from 'react';
import { Question, UserAnswer, QuizResult, Category, QuestionType, User } from '@/types';
import QuizCard from '@/components/QuizCard';
import ResultCard from '@/components/ResultCard';
import FilterBar from '@/components/FilterBar';
import WrongAnswersNote from '@/components/WrongAnswersNote';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import MyPage from '@/components/MyPage';
import { signOut } from '@/lib/supabase';
import { koreanMockQuestions } from '@/data/mockQuestions';

export default function Home() {
    const [currentView, setCurrentView] = useState<'login' | 'signup' | 'main'>('login');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showMyPage, setShowMyPage] = useState(false);
    const [allQuestions] = useState<Question[]>(koreanMockQuestions);
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [showWrongAnswers, setShowWrongAnswers] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category>('전체');
    const [selectedType, setSelectedType] = useState<QuestionType>('전체');
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => { const a = sessionStorage.getItem('authenticated'); const u = sessionStorage.getItem('current-user'); if (a === 'true' && u) { setCurrentUser(JSON.parse(u)); setCurrentView('main'); } }, []);

    const shuffle = <T,>(arr: T[]): T[] => { const s = [...arr]; for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[s[i], s[j]] = [s[j], s[i]]; } return s; };

    useEffect(() => { let f = allQuestions; if (selectedCategory !== '전체') f = f.filter(q => q.category === selectedCategory); if (selectedType !== '전체') f = f.filter(q => q.type === selectedType); setFilteredQuestions(f); }, [selectedCategory, selectedType, allQuestions]);

    const handleLoginSuccess = (user: User) => { setCurrentUser(user); setCurrentView('main'); };
    const handleLogout = async () => { await signOut(); sessionStorage.clear(); setCurrentUser(null); setCurrentView('login'); setIsStarted(false); setShowResult(false); setShowWrongAnswers(false); setShowMyPage(false); };
    const handleAnswer = (qid: string, sel: string, cor: boolean) => { setUserAnswers(p => [...p, { questionId: qid, selectedAnswer: sel, isCorrect: cor }]); };
    const handleNext = () => { if (currentQuestionIndex < filteredQuestions.length - 1) setCurrentQuestionIndex(p => p + 1); else setShowResult(true); };
    const handleRestart = () => { setCurrentQuestionIndex(0); setUserAnswers([]); setShowResult(false); setShowWrongAnswers(false); setIsStarted(false); };
    const handleStart = () => { if (filteredQuestions.length === 0) { alert('문제가 없습니다.'); return; } setFilteredQuestions(shuffle(filteredQuestions)); setIsStarted(true); };
    const calcResult = (): QuizResult => { const c = userAnswers.filter(a => a.isCorrect).length; return { totalQuestions: filteredQuestions.length, correctAnswers: c, incorrectAnswers: filteredQuestions.length - c, score: Math.round((c / filteredQuestions.length) * 100), answers: userAnswers }; };

    const cur = filteredQuestions[currentQuestionIndex];
    const answered = userAnswers.some(a => a.questionId === cur?.id);

    if (currentView === 'login') return <Login onSuccess={handleLoginSuccess} onSignUp={() => setCurrentView('signup')} />;
    if (currentView === 'signup') return <SignUp onSuccess={handleLoginSuccess} onBackToLogin={() => setCurrentView('login')} />;
    if (showMyPage && currentUser) return <MyPage user={currentUser} onClose={() => setShowMyPage(false)} />;

    const t = { bg: '#1a1a1a', card: '#252525', border: '#333', text: '#e0e0e0', muted: '#888', accent: '#14b8a6', accentDark: '#0d9488' };

    return (
        <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${t.bg} 0%, #0d0d0d 100%)`, padding: '24px 16px', fontFamily: "'Pretendard Variable', sans-serif" }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* 헤더 */}
                <div style={{ background: t.card, borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${t.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '44px', height: '44px', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDark} 100%)`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>⚡</div>
                        <div><div style={{ fontSize: '17px', fontWeight: '700', color: t.text }}>전기기사 필기</div><div style={{ fontSize: '12px', color: t.muted }}>{currentUser?.name}님</div></div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setShowMyPage(true)} style={{ padding: '10px 16px', background: 'rgba(20,184,166,0.1)', border: `1px solid rgba(20,184,166,0.3)`, borderRadius: '10px', color: t.accent, fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>📚 마이페이지</button>
                        <button onClick={handleLogout} style={{ padding: '10px 16px', background: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', color: t.muted, fontSize: '13px', cursor: 'pointer' }}>로그아웃</button>
                    </div>
                </div>

                {!isStarted && !showResult && (
                    <>
                        <FilterBar selectedCategory={selectedCategory} selectedType={selectedType} onCategoryChange={setSelectedCategory} onTypeChange={setSelectedType} />
                        <div style={{ background: t.card, borderRadius: '16px', padding: '48px', textAlign: 'center', border: `1px solid ${t.border}` }}>
                            <div style={{ fontSize: '56px', marginBottom: '20px' }}>📝</div>
                            <h2 style={{ fontSize: '26px', fontWeight: '700', color: t.text, marginBottom: '8px' }}>선택된 문제: {filteredQuestions.length}개</h2>
                            <p style={{ color: t.muted, marginBottom: '36px', fontSize: '15px' }}>필터를 선택하고 시작하세요 (랜덤 출제)</p>
                            <button onClick={handleStart} style={{ padding: '18px 56px', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDark} 100%)`, color: 'white', border: 'none', borderRadius: '14px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 8px 24px rgba(20,184,166,0.3)' }}>시작하기</button>
                        </div>
                    </>
                )}

                {isStarted && !showResult && cur && (
                    <>
                        {/* 진행률 + 홈 버튼 */}
                        <div style={{ background: t.card, borderRadius: '10px', padding: '16px', marginBottom: '16px', border: `1px solid ${t.border}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <button onClick={handleRestart} style={{ padding: '8px 16px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', color: t.muted, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    ← 홈으로
                                </button>
                                <span style={{ fontSize: '14px', color: t.text, fontWeight: '600' }}>{currentQuestionIndex + 1} / {filteredQuestions.length}</span>
                            </div>
                            <div style={{ height: '8px', background: t.border, borderRadius: '4px', overflow: 'hidden' }}><div style={{ height: '100%', background: `linear-gradient(90deg, ${t.accent}, ${t.accentDark})`, borderRadius: '4px', width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`, transition: 'width 0.3s' }} /></div>
                        </div>
                        <QuizCard question={cur} questionNumber={currentQuestionIndex + 1} totalQuestions={filteredQuestions.length} onAnswer={handleAnswer} showResult={showResult} />
                        {answered && <button onClick={handleNext} style={{ display: 'block', margin: '24px auto 0', padding: '16px 48px', background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentDark} 100%)`, color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 16px rgba(20,184,166,0.3)' }}>{currentQuestionIndex < filteredQuestions.length - 1 ? '다음 문제' : '결과 보기'}</button>}
                    </>
                )}

                {showResult && !showWrongAnswers && <ResultCard result={calcResult()} onRestart={handleRestart} onShowWrongAnswers={() => setShowWrongAnswers(true)} />}
                {showResult && showWrongAnswers && <WrongAnswersNote questions={filteredQuestions} userAnswers={userAnswers} onClose={() => setShowWrongAnswers(false)} />}
            </div>
        </div>
    );
}
