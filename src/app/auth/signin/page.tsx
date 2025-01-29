'use client';

import { signIn } from "next-auth/react";

const providers = [
  {
    id: "github",
    name: "GitHub",
  },
  {
    id: "google",
    name: "Google",
  },
];

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Projectify
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage and showcase your projects
          </p>
        </div>
        <div className="mt-8 space-y-4">
          {providers.map((provider) => (
            <div key={provider.name}>
              <button
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 