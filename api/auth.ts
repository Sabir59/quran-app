/**
 * api/auth.ts — Auth network layer (Firebase)
 *
 * All auth operations go through Firebase Auth + Firestore.
 */

import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import type {
  AuthSession,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

// ─── Helper ───────────────────────────────────────────────────────────────────

function nameFromEmail(email: string): string {
  return email
    .split("@")[0]
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function buildSessionFromFirebaseUser(user: FirebaseUser): AuthSession {
  return {
    user: {
      id: user.uid,
      name: user.displayName ?? nameFromEmail(user.email ?? ""),
      email: user.email ?? "",
      avatar: user.photoURL ?? undefined,
      role: "user",
      emailVerified: user.emailVerified,
      createdAt: user.metadata.creationTime ?? new Date().toISOString(),
    },
    // Firebase manages tokens internally — these are placeholders
    accessToken: "",
    refreshToken: "",
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const { user } = await signInWithEmailAndPassword(
    auth,
    payload.email,
    payload.password,
  );
  return buildSessionFromFirebaseUser(user);
}

export async function register(
  payload: RegisterPayload,
): Promise<{ email: string }> {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    payload.email,
    payload.password,
  );
  await updateProfile(user, { displayName: payload.name });
  // Create user document in Firestore
  await setDoc(doc(db, "users", user.uid), {
    name: payload.name,
    email: payload.email,
    createdAt: new Date().toISOString(),
    bookmarks: [],
    photoURL: "",
    reciter: "ar.alafasy",
    translationEdition: "en.asad",
    streak: 0,
    surahsRead: 0,
    totalListeningSeconds: 0,
  });
  return { email: payload.email };
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<void> {
  await sendPasswordResetEmail(auth, payload.email);
}

export async function googleSignIn(idToken: string): Promise<AuthSession> {
  const credential = GoogleAuthProvider.credential(idToken);
  const { user } = await signInWithCredential(auth, credential);
  // Create Firestore doc if first time sign-in
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName ?? nameFromEmail(user.email ?? ""),
      email: user.email ?? "",
      createdAt: new Date().toISOString(),
      bookmarks: [],
      photoURL: user.photoURL ?? "",
      reciter: "ar.alafasy",
      translationEdition: "en.asad",
      streak: 0,
      surahsRead: 0,
      totalListeningSeconds: 0,
    });
  }
  return buildSessionFromFirebaseUser(user);
}
