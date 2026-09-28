import { getApps, initializeApp } from 'firebase/app';

/** Firebase 웹 설정은 클라이언트 공개값이며, 앱과 서비스워커에서 같은 프로젝트를 사용합니다. */
export const firebaseConfig = {
  apiKey: 'AIzaSyASuGz-p106XMMnRLlOdZ22LVd8T1Raptg',
  authDomain: 'pantry--mate.firebaseapp.com',
  projectId: 'pantry--mate',
  storageBucket: 'pantry--mate.firebasestorage.app',
  messagingSenderId: '309150824223',
  appId: '1:309150824223:web:d77bde3adc16bd7783622a',
  measurementId: 'G-WV1QMZNSPV',
} as const;

export const firebaseApp =
  getApps().find((app) => app.name === '[DEFAULT]') ?? initializeApp(firebaseConfig);

export const firebaseVapidKey =
  'BOS__IMHVCkIVZw8tjkSFZOaAu9gXcDsrXDGBfZS5EgMA3tYa3-Z9VLHBCV4Q9zyNN5aXDrGpkOUrBkPNtIzXNE';
