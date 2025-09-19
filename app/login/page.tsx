"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      router.push('/dashboard'); 

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center pt-10 px-4">
      <h1 className="text-5xl font-semibold mb-8 text-gray-800">Login Details</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
            phone / Email / ME Number
          </label>
          <input
            type="text"
            name="identifier"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>
        <div>
          <label htmlFor="password"className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          />
        </div>

        {error && <p className="text-sm text-center text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-xl py-2 mt-4 text-white font-semibold bg-gray-400 hover:bg-gray-500 rounded-md disabled:bg-gray-300"
        >
          {isLoading ? 'Signing In...' : 'Next'}
        </button>
      </form>

      <div className="mt-12">
        <Image src="/pws-logo.png" alt="PWS Logo" width={500} height={150} />
      </div>
    </div>
  );
}