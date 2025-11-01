'use client';
import { login } from '@/lib/auth-actions';

export default function GithubSignInButton() {
  return (
    <button
      className="w-full flex bg-gray-900 text-foreground items-center justify-center gap-3 px-4 py-3 font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
      onClick={() => login()}
    >
      <svg
        className="size-5"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.73 3.72 11.97C4.33 13.15 5.4 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.09 6.01 4.13C6.64 3.95 7.32 3.86 8 3.86C8.68 3.86 9.36 3.95 9.99 4.13C11.5 3.09 12.17 3.31 12.17 3.31C12.61 4.41 12.33 5.23 12.25 5.43C12.76 5.99 13.07 6.71 13.07 7.58C13.07 10.65 11.2 11.33 9.42 11.53C9.72 11.78 9.97 12.27 9.97 13.03C9.97 14.11 9.96 14.96 9.96 15.21C9.96 15.42 10.1 15.67 10.5 15.59C13.68 14.53 16 11.54 16 8C16 3.58 12.42 0 8 0Z"
        />
      </svg>
      Continue With Github
    </button>
  );
}
