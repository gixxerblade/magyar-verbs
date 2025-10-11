import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { isAuthorizedEmail } from '../utils/utils';

export interface AuthContext {
  user: User | null;
}

// This will be available to all child routes
export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    // Wait for auth state to be determined
    const user = await new Promise<User | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });

    // If user is not authenticated, redirect to home
    if (!user) {
      throw redirect({
        to: '/',
        search: {
          redirect: window.location.pathname,
        },
      });
    }

    // Check if user's email is authorized
    if (!isAuthorizedEmail(user.email)) {
      // Sign out unauthorized user
      await signOut(auth);

      throw redirect({
        to: '/',
        search: {
          unauthorized: 'true',
        },
      });
    }

    return {
      user,
    };
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}
