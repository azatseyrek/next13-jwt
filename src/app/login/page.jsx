'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const username = formData.get('username');
    const password = formData.get('password');

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { success } = await res.json();

    if (success) {
      const nextUrl = searchParams.get('nextUrl') ?? '/';
      router.push(nextUrl);
    } else {
      alert('Username or password is wrong!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username" />
      </label>
      <label>
        Password:
        <input type="password" name="password" />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
