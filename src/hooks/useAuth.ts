import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { queryKeys } from '../lib/queryKeys';

// Sign in with Google
async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// Sign out
async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Get current auth state
async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

// Hook to get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.user.queryKey,
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });
}

// Hook to sign in
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.user.queryKey, user);
    },
    onError: (error) => {
      // Handle popup closed by user or other auth errors
      console.error('Sign in error:', error);
    },
  });
}

// Hook to sign out
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.user.queryKey, null);
    },
  });
}
