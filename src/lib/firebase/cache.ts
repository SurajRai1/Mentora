import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { openDB } from 'idb';

const DB_NAME = 'mentora-cache';
const DB_VERSION = 1;

export const initCache = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores for different data types
      db.createObjectStore('users');
      db.createObjectStore('studySessions');
      db.createObjectStore('quizzes');
      db.createObjectStore('progress');
    },
  });
  return db;
};

export const cacheData = async (storeName: string, key: string, data: any) => {
  const db = await initCache();
  await db.put(storeName, data, key);
};

export const getCachedData = async (storeName: string, key: string) => {
  const db = await initCache();
  return await db.get(storeName, key);
};

export const clearCache = async (storeName: string) => {
  const db = await initCache();
  await db.clear(storeName);
};