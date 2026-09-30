export type FirebaseConfigEnvironment = {
  NEXT_PUBLIC_FIREBASE_API_KEY?: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
  NEXT_PUBLIC_FIREBASE_APP_ID?: string;
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string;
};

export function createFirebaseConfig(environment: FirebaseConfigEnvironment) {
  return {
    apiKey: environment.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
    authDomain: environment.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: environment.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
    storageBucket: environment.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: environment.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: environment.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
    measurementId: environment.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
  };
}

export function hasFirebaseMessagingConfig(config: ReturnType<typeof createFirebaseConfig>) {
  return Boolean(config.apiKey && config.projectId && config.messagingSenderId && config.appId);
}
