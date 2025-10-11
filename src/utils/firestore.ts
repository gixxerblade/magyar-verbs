import dayjs from 'dayjs';
import type { Timestamp } from 'firebase/firestore';

/**
 * Convert Firestore Timestamp fields to JavaScript Date objects
 * @param data - Raw Firestore document data
 * @returns Document data with converted timestamps
 */
export function convertFirestoreTimestamps<T>(data: Record<string, unknown>): T {
  return {
    ...data,
    createdAt: data.createdAt ? dayjs((data.createdAt as Timestamp).toDate()).toDate() : undefined,
    updatedAt: data.updatedAt ? dayjs((data.updatedAt as Timestamp).toDate()).toDate() : undefined,
  } as T;
}
