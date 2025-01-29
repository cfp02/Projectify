'use client';

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Projectify</h1>
        
        <div className="mb-8">
          {status === "loading" ? (
            <p>Loading...</p>
          ) : session ? (
            <div className="space-y-4">
              <p className="text-xl">
                Signed in as {session.user?.email}
              </p>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
              <div className="mt-4">
                <pre className="bg-gray-100 p-4 rounded">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xl mb-4">Not signed in</p>
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 