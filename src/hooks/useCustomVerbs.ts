import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { queryKeys } from '../lib/queryKeys';
import type { VerbFormData } from '../schemas/verb.schema';
import type { VerbEntry } from '../types';
import { convertFirestoreTimestamps } from '../utils/firestore';

const CUSTOM_VERBS_COLLECTION = 'customVerbs';

// Fetch all custom verbs
async function fetchCustomVerbs(): Promise<VerbEntry[]> {
  const verbsCollection = collection(db, CUSTOM_VERBS_COLLECTION);
  const verbsQuery = query(verbsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(verbsQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertFirestoreTimestamps<VerbEntry>(doc.data()),
  }));
}

// Query options for custom verbs (for use in loaders)
export const customVerbsQueryOptions = queryOptions({
  queryKey: queryKeys.customVerbs.all.queryKey,
  queryFn: fetchCustomVerbs,
});

// Add new custom verb
async function addCustomVerb(data: VerbFormData): Promise<VerbEntry> {
  const verbsCollection = collection(db, CUSTOM_VERBS_COLLECTION);
  const now = Timestamp.now();

  const docRef = await addDoc(verbsCollection, {
    ...data,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id: docRef.id,
    ...data,
    createdAt: dayjs(now.toDate()).toDate(),
    updatedAt: dayjs(now.toDate()).toDate(),
  } as VerbEntry;
}

// Update existing custom verb
async function updateCustomVerb(id: string, data: Partial<VerbFormData>): Promise<void> {
  const docRef = doc(db, CUSTOM_VERBS_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// Delete custom verb
async function deleteCustomVerb(id: string): Promise<void> {
  const docRef = doc(db, CUSTOM_VERBS_COLLECTION, id);
  await deleteDoc(docRef);
}

// Hook to fetch all custom verbs
export function useCustomVerbs() {
  return useQuery(customVerbsQueryOptions);
}

// Hook to add custom verb
export function useAddCustomVerb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCustomVerb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customVerbs.all.queryKey });
    },
  });
}

// Hook to update custom verb
export function useUpdateCustomVerb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VerbFormData> }) =>
      updateCustomVerb(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customVerbs.all.queryKey });
    },
  });
}

// Hook to delete custom verb
export function useDeleteCustomVerb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomVerb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customVerbs.all.queryKey });
    },
  });
}
