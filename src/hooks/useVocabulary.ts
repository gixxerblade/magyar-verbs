import {queryOptions, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
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
import {db} from '../lib/firebase';
import {queryKeys} from '../lib/queryKeys';
import type {VocabularyEntry, VocabularyFormData} from '../types';
import {convertFirestoreTimestamps} from '../utils/firestore';

const VOCABULARY_COLLECTION = 'vocabulary';

// Fetch all vocabulary entries
export async function fetchVocabulary(): Promise<VocabularyEntry[]> {
  const vocabularyCollection = collection(db, VOCABULARY_COLLECTION);
  const vocabularyQuery = query(vocabularyCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(vocabularyQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertFirestoreTimestamps<VocabularyEntry>(doc.data()),
  }));
}

export const vocabularyOptions = queryOptions({
  ...queryKeys.vocabulary.all,
  queryFn: fetchVocabulary,
});

// Add new vocabulary entry
async function addVocabulary(data: VocabularyFormData): Promise<VocabularyEntry> {
  const vocabularyCollection = collection(db, VOCABULARY_COLLECTION);
  const now = Timestamp.now();

  const docRef = await addDoc(vocabularyCollection, {
    ...data,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id: docRef.id,
    ...data,
    createdAt: dayjs(now.toDate()).toDate(),
    updatedAt: dayjs(now.toDate()).toDate(),
  };
}

// Update existing vocabulary entry
async function updateVocabulary(id: string, data: Partial<VocabularyFormData>): Promise<void> {
  const docRef = doc(db, VOCABULARY_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// Delete vocabulary entry
async function deleteVocabulary(id: string): Promise<void> {
  const docRef = doc(db, VOCABULARY_COLLECTION, id);
  await deleteDoc(docRef);
}

// Hook to fetch all vocabulary
export function useVocabulary() {
  return useQuery({
    queryKey: queryKeys.vocabulary.all.queryKey,
    queryFn: fetchVocabulary,
  });
}

// Hook to add vocabulary
export function useAddVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addVocabulary,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.vocabulary.all.queryKey});
    },
  });
}

// Hook to update vocabulary
export function useUpdateVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: Partial<VocabularyFormData>}) =>
      updateVocabulary(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.vocabulary.all.queryKey});
    },
  });
}

// Hook to delete vocabulary
export function useDeleteVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVocabulary,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.vocabulary.all.queryKey});
    },
  });
}
