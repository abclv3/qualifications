import { createClient } from '@supabase/supabase-js';
import { User } from '@/types';

// 환경 변수 디버그
console.log('🔍 Environment Check:');
console.log('- NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 유효성 검사
const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidKey = (key: string) => key && key.length > 20;

// Supabase 클라이언트 생성
let supabase: ReturnType<typeof createClient> | null = null;
try {
  if (isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey)) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase connected');
  } else {
    console.warn('⚠️ Supabase credentials not configured - running in offline mode');
  }
} catch (error) {
  console.error('❌ Supabase initialization error:', error);
  supabase = null;
}

export { supabase };

// Supabase 사용 가능 여부
export const isSupabaseEnabled = () => !!supabase;

// 현재 사용자 정보
export const getCurrentUser = async () => {
  if (!supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return null;
  }
};

// 로그인
export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// 회원가입 (Trigger 방식)
export const signUp = async (email: string, password: string, userData: { username: string; name: string }) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } };
  }

  try {
    console.log('🚀 회원가입 시작 (Trigger 방식)');

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: userData.username,
          name: userData.name,
        }
      }
    });

    if (authError) {
      console.error('❌ Supabase Auth 회원가입 실패:', authError);
      return { data: null, error: authError };
    }

    console.log('✅ Supabase Auth 회원가입 성공:', authData);
    return { data: authData, error: null };
  } catch (error) {
    console.error('❌ 회원가입 예외 발생:', error);
    return { data: null, error };
  }
};

// 로그아웃
export const signOut = async () => {
  if (!supabase) return { error: null };
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
};

// 사용자 정보 조회 (auth_id로)
export const getUserByAuthId = async (authId: string): Promise<User | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error || !data) return null;

    const userData = data as any;
    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      name: userData.name,
      authId: userData.auth_id,
      created_at: userData.created_at,
    };
  } catch (error) {
    console.error('getUserByAuthId error:', error);
    return null;
  }
};

// username으로 email 조회
export const getEmailByUsername = async (username: string): Promise<string | null> => {
  if (!supabase) return null;
  try {
    const { data, error } = await (supabase as any)
      .rpc('get_email_by_username', { input_username: username });

    if (error) return null;
    return data;
  } catch (error) {
    console.error('getEmailByUsername error:', error);
    return null;
  }
};

// 모든 문제 가져오기
export async function getAllQuestions() {
  if (!supabase) {
    console.warn('Supabase가 설정되지 않았습니다. Mock 데이터를 사용하세요.');
    return [];
  }

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }

  return data || [];
}

// 저장된 노트 가져오기 (사용자별)
export async function getSavedNotes(userId: string) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('saved_notes')
    .select(`
            *,
            question:questions(*)
        `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved notes:', error);
    return [];
  }

  return data || [];
}

// 노트 저장
export async function saveNote(userId: string, questionId: string, noteType: 'wrong_answer' | 'memo', userAnswer?: string, memo?: string) {
  if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };

  try {
    const { data, error } = await (supabase as any)
      .from('saved_notes')
      .insert({
        user_id: userId,
        question_id: questionId,
        note_type: noteType,
        user_answer: userAnswer,
        memo: memo,
      })
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

// 노트 삭제
export async function deleteNote(noteId: string) {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  try {
    const { error } = await supabase
      .from('saved_notes')
      .delete()
      .eq('id', noteId);

    return { error };
  } catch (error) {
    return { error };
  }
}
