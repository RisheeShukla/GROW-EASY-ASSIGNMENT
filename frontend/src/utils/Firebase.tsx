"use client";
import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {initializeApp}  from "firebase/app";



type FirebaseContextValue = {
  signupUserWithEmailAndPassword: (name: string, email: string, password: string) => Promise<void>;
  signinUserWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signinUserWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  user: User | null;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

const firebaseConfig = {
  apiKey:process.env.NEXT_PUBLIC_API_KEY,
  authDomain:process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId:process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const firebaseApp=initializeApp(firebaseConfig);
 const firebaseAuth=getAuth(firebaseApp);
 const googleProvider=new GoogleAuthProvider();


export const FirebaseProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const signupUserWithEmailAndPassword = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

    await updateProfile(userCredential.user, {
      displayName: name,
    });
  };

  const signinUserWithEmailAndPassword = async (
    email: string,
    password: string
  ): Promise<void> => {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  const signinUserWithGoogle = async (): Promise<void> => {
    await signInWithPopup(firebaseAuth, googleProvider);
  };

  const isLoggedIn = user !== null;

  const logout = async (): Promise<void> => {
    await signOut(firebaseAuth);
    setUser(null);
  };

  return (
    <FirebaseContext.Provider
      value={{
        signupUserWithEmailAndPassword,
        signinUserWithEmailAndPassword,
        signinUserWithGoogle,
        logout,
        isLoggedIn,
        user,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);

  if (!context) {
    throw new Error("useFirebase must be used within FirebaseProvider");
  }

  return context;
};
 