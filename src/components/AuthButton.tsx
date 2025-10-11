import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import type { User } from 'firebase/auth';
import { useSignIn, useSignOut } from '../hooks/useAuth';

interface AuthButtonProps {
  user: User | null;
}

export function AuthButton({ user }: AuthButtonProps) {
  const signInMutation = useSignIn();
  const signOutMutation = useSignOut();

  const handleSignIn = () => {
    signInMutation.mutate();
  };

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  const isLoading = signInMutation.isPending || signOutMutation.isPending;

  if (user) {
    return (
      <div className='flex items-center gap-3'>
        <span className='text-sm text-gray-600 hidden sm:inline'>{user.email}</span>
        <button
          type='button'
          onClick={handleSignOut}
          disabled={isLoading}
          className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
        >
          <ArrowLeftStartOnRectangleIcon className='w-4 h-4' aria-hidden='true' />
          {isLoading ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    );
  }

  return (
    <button
      type='button'
      onClick={handleSignIn}
      disabled={isLoading}
      className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-full hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg'
    >
      <ArrowRightStartOnRectangleIcon className='w-4 h-4' aria-hidden='true' />
      {isLoading ? 'Signing in...' : 'Sign In'}
    </button>
  );
}
