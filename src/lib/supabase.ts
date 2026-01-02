import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, SavedNote, Question } from '@/types';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCn-kAKUqU-aJ5_q47tT5grh0gaToOrYp8",
  authDomain: "qualificatons.firebaseapp.com",
  projectId: "qualificatons",
  storageBucket: "qualificatons.firebasestorage.app",
  messagingSenderId: "564769274954",
  appId: "1:564769274954:web:97472e9e41e6be7e9afab3"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 회원가입
export const signUp = async (email: string, password: string, metadata: { username: string; name: string }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore에 사용자 정보 저장
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      username: metadata.username,
      name: metadata.name,
      createdAt: serverTimestamp()
    });

    return { data: { user }, error: null };
  } catch (error: any) {
    return { data: null, error: { message: getErrorMessage(error.code) } };
  }
};

// 로그인
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { data: { user: userCredential.user }, error: null };
  } catch (error: any) {
    return { data: null, error: { message: getErrorMessage(error.code) } };
  }
};

// 로그아웃
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('로그아웃 에러:', error);
  }
};

// 아이디로 이메일 찾기
export const getEmailByUsername = async (username: string): Promise<string | null> => {
  try {
    console.log('[DEBUG] username으로 이메일 조회 시작:', username);
    const q = query(collection(db, 'users'), where('username', '==', username));
    const snapshot = await getDocs(q);
    console.log('[DEBUG] Firestore 쿼리 성공, 결과 수:', snapshot.size);
    if (snapshot.empty) {
      console.log('[DEBUG] 사용자를 찾을 수 없음:', username);
      // 디버깅: 모든 users 문서 출력
      try {
        const allUsersSnapshot = await getDocs(collection(db, 'users'));
        console.log('[DEBUG] 전체 users 수:', allUsersSnapshot.size);
        allUsersSnapshot.docs.forEach(doc => {
          console.log('[DEBUG] 저장된 username:', doc.data().username);
        });
      } catch (e) {
        console.log('[DEBUG] 전체 users 조회 실패:', e);
      }
      return null;
    }
    const email = snapshot.docs[0].data().email;
    console.log('[DEBUG] 이메일 찾음:', email);
    return email;
  } catch (error: any) {
    // 에러 발생 시 화면에 표시 (디버깅용)
    const errorMsg = `[Firestore 에러] 코드: ${error?.code}, 메시지: ${error?.message}`;
    console.error(errorMsg);
    alert(errorMsg); // 디버깅용 - 나중에 제거
    return null;
  }
};

// Auth ID로 사용자 정보 가져오기
export const getUserByAuthId = async (authId: string): Promise<User | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'users', authId));
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      id: authId,
      username: data.username,
      name: data.name,
      email: data.email,
      authId: authId
    };
  } catch (error) {
    console.error('사용자 조회 에러:', error);
    return null;
  }
};

// 아이디 중복 확인
export const checkUsernameExists = async (username: string): Promise<boolean> => {
  try {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    return false;
  }
};

// 노트 저장
export const saveNote = async (userId: string, questionId: string, noteType: 'wrong_answer' | 'memo', userAnswer?: string, memo?: string) => {
  try {
    await addDoc(collection(db, 'notes'), {
      userId,
      questionId,
      noteType,
      userAnswer: userAnswer || null,
      memo: memo || null,
      createdAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// 저장된 노트 가져오기
export const getSavedNotes = async (userId: string): Promise<SavedNote[]> => {
  try {
    const q = query(collection(db, 'notes'), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    // mockQuestions에서 문제 정보 가져오기
    const { koreanMockQuestions } = await import('@/data/mockQuestions');

    return snapshot.docs.map(doc => {
      const data = doc.data();
      const question = koreanMockQuestions.find(q => q.id === data.questionId) || {} as Question;
      return {
        id: doc.id,
        user_id: data.userId,
        question_id: data.questionId,
        question,
        note_type: data.noteType,
        user_answer: data.userAnswer,
        memo: data.memo,
        created_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });
  } catch (error) {
    console.error('노트 조회 에러:', error);
    return [];
  }
};

// 노트 삭제
export const deleteNote = async (noteId: string) => {
  try {
    await deleteDoc(doc(db, 'notes', noteId));
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// 에러 메시지 변환
const getErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use': return '이미 사용 중인 이메일입니다.';
    case 'auth/invalid-email': return '유효하지 않은 이메일 형식입니다.';
    case 'auth/weak-password': return '비밀번호가 너무 약합니다.';
    case 'auth/user-not-found': return '존재하지 않는 사용자입니다.';
    case 'auth/wrong-password': return '비밀번호가 올바르지 않습니다.';
    case 'auth/invalid-credential': return '아이디 또는 비밀번호가 올바르지 않습니다.';
    default: return '오류가 발생했습니다.';
  }
};

// 기존 Supabase 호환용 (사용하지 않음)
export const supabase = null;
export const getAllQuestions = async () => [];
