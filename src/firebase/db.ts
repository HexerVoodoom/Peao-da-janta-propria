import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import type { Profiles, CategoryWeights, FlavorWeights, HistoryEntry } from '../types';
import { DEFAULT_CATEGORY_WEIGHTS, DEFAULT_FLAVOR_WEIGHTS } from '../data/foods';

const APP_DOC = 'peao-da-janta';

// ── Profiles ──────────────────────────────────────────────

export async function loadProfiles(): Promise<Profiles | null> {
  if (!isFirebaseConfigured) return null;
  try {
    const snap = await getDoc(doc(db, APP_DOC, 'profiles'));
    return snap.exists() ? (snap.data() as Profiles) : null;
  } catch {
    return null;
  }
}

export async function saveProfiles(profiles: Profiles): Promise<void> {
  if (!isFirebaseConfigured) return;
  await setDoc(doc(db, APP_DOC, 'profiles'), profiles);
}

export function subscribeProfiles(cb: (p: Profiles) => void) {
  if (!isFirebaseConfigured) return () => {};
  return onSnapshot(doc(db, APP_DOC, 'profiles'), (snap) => {
    if (snap.exists()) cb(snap.data() as Profiles);
  });
}

// ── Weights ────────────────────────────────────────────────

export async function loadWeights(): Promise<{ categories: CategoryWeights; flavors: FlavorWeights } | null> {
  if (!isFirebaseConfigured) return null;
  try {
    const snap = await getDoc(doc(db, APP_DOC, 'weights'));
    return snap.exists() ? (snap.data() as { categories: CategoryWeights; flavors: FlavorWeights }) : null;
  } catch {
    return null;
  }
}

export async function saveWeights(categories: CategoryWeights, flavors: FlavorWeights): Promise<void> {
  if (!isFirebaseConfigured) return;
  await setDoc(doc(db, APP_DOC, 'weights'), { categories, flavors });
}

export function subscribeWeights(cb: (w: { categories: CategoryWeights; flavors: FlavorWeights }) => void) {
  if (!isFirebaseConfigured) return () => {};
  return onSnapshot(doc(db, APP_DOC, 'weights'), (snap) => {
    if (snap.exists()) cb(snap.data() as { categories: CategoryWeights; flavors: FlavorWeights });
  });
}

// ── History ────────────────────────────────────────────────

export async function addHistoryEntry(entry: Omit<HistoryEntry, 'id'>): Promise<string> {
  if (!isFirebaseConfigured) return crypto.randomUUID();
  const ref = await addDoc(collection(db, APP_DOC, 'data', 'history'), entry);
  return ref.id;
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  if (!isFirebaseConfigured) return [];
  try {
    const q = query(collection(db, APP_DOC, 'data', 'history'), orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as HistoryEntry));
  } catch {
    return [];
  }
}

export function subscribeHistory(cb: (h: HistoryEntry[]) => void) {
  if (!isFirebaseConfigured) return () => {};
  const q = query(collection(db, APP_DOC, 'data', 'history'), orderBy('date', 'desc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as HistoryEntry)));
  });
}

// ── Default data ───────────────────────────────────────────

export const DEFAULT_PROFILES: Profiles = {
  matheus: { likes: [], dislikes: [] },
  amanda: { likes: [], dislikes: [] },
};

export const DEFAULT_WEIGHTS = {
  categories: DEFAULT_CATEGORY_WEIGHTS,
  flavors: DEFAULT_FLAVOR_WEIGHTS,
};
